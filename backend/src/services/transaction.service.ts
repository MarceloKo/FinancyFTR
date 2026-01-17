import { Prisma } from '@prisma/client'
import { prismaClient } from '../../prisma/prisma.js'
import { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input.js'

export type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: { category: true }
}>

export class TransactionService {
  async listTransactions(userId: string): Promise<TransactionWithCategory[]> {
    return prismaClient.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    })
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
