import { prismaClient } from '../../prisma/prisma.js'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input.js'

export class CategoryService {
  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  async getCategory(id: string, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) throw new Error('Categoria não encontrada!')
    if (category.userId !== userId) throw new Error('Você não tem permissão para acessar esta categoria!')

    return category
  }

  async createCategory(data: CreateCategoryInput, userId: string) {
    const existingCategory = await prismaClient.category.findUnique({
      where: {
        name_userId: {
          name: data.name,
          userId,
        },
      },
    })

    if (existingCategory) throw new Error('Já existe uma categoria com este nome!')

    return prismaClient.category.create({
      data: {
        name: data.name,
        color: data.color,
        userId,
      },
    })
  }

  async updateCategory(id: string, data: UpdateCategoryInput, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) throw new Error('Categoria não encontrada!')
    if (category.userId !== userId) throw new Error('Você não tem permissão para editar esta categoria!')

    if (data.name) {
      const existingCategory = await prismaClient.category.findUnique({
        where: {
          name_userId: {
            name: data.name,
            userId,
          },
        },
      })

      if (existingCategory && existingCategory.id !== id) {
        throw new Error('Já existe uma categoria com este nome!')
      }
    }

    return prismaClient.category.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        color: data.color,
      },
    })
  }

  async deleteCategory(id: string, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) throw new Error('Categoria não encontrada!')
    if (category.userId !== userId) throw new Error('Você não tem permissão para deletar esta categoria!')

    await prismaClient.category.delete({
      where: {
        id,
      },
    })

    return true
  }
}
