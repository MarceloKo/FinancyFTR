import { Prisma } from '@prisma/client'
import { prismaClient } from '../../prisma/prisma.js'
import { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input.js'
import { TransactionFilterInput } from '../dtos/input/transaction-filter.input.js'

export type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: { category: true }
}>

export interface PaginatedTransactions {
  transactions: TransactionWithCategory[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class TransactionService {
  async listTransactions(userId: string, filters?: TransactionFilterInput): Promise<PaginatedTransactions> {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? 10
    const skip = (page - 1) * limit

    const where: Prisma.TransactionWhereInput = {
      userId,
    }

    if (filters?.search) {
      where.title = {
        contains: filters.search,
      }
    }

    if (filters?.type) {
      where.type = filters.type
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters?.month && filters?.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1)
      const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59, 999)
      where.date = {
        gte: startDate,
        lte: endDate,
      }
    } else if (filters?.year) {
      const startDate = new Date(filters.year, 0, 1)
      const endDate = new Date(filters.year, 11, 31, 23, 59, 59, 999)
      where.date = {
        gte: startDate,
        lte: endDate,
      }
    }

    const [transactions, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: limit,
      }),
      prismaClient.transaction.count({ where }),
    ])

    return {
      transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getTransaction(id: string, userId: string): Promise<TransactionWithCategory> {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    })

    if (!transaction) throw new Error('Transação não encontrada!')
    if (transaction.userId !== userId) throw new Error('Você não tem permissão para acessar esta transação!')

    return transaction
  }

  async createTransaction(data: CreateTransactionInput, userId: string): Promise<TransactionWithCategory> {
    if (data.categoryId) {
      const category = await prismaClient.category.findUnique({
        where: {
          id: data.categoryId,
        },
      })

      if (!category) throw new Error('Categoria não encontrada!')
      if (category.userId !== userId) throw new Error('Você não tem permissão para usar esta categoria!')
    }

    return prismaClient.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        date: data.date,
        categoryId: data.categoryId,
        userId,
      },
      include: {
        category: true,
      },
    })
  }

  async updateTransaction(id: string, data: UpdateTransactionInput, userId: string): Promise<TransactionWithCategory> {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id,
      },
    })

    if (!transaction) throw new Error('Transação não encontrada!')
    if (transaction.userId !== userId) throw new Error('Você não tem permissão para editar esta transação!')

    if (data.categoryId) {
      const category = await prismaClient.category.findUnique({
        where: {
          id: data.categoryId,
        },
      })

      if (!category) throw new Error('Categoria não encontrada!')
      if (category.userId !== userId) throw new Error('Você não tem permissão para usar esta categoria!')
    }

    return prismaClient.transaction.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        date: data.date,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    })
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id,
      },
    })

    if (!transaction) throw new Error('Transação não encontrada!')
    if (transaction.userId !== userId) throw new Error('Você não tem permissão para deletar esta transação!')

    await prismaClient.transaction.delete({
      where: {
        id,
      },
    })

    return true
  }
}
