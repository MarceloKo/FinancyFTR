import { User } from '@prisma/client'
import { prismaClient } from '../../prisma/prisma.js'
import { UpdateUserInput } from '../dtos/input/user.input.js'

export class UserService {
  async getProfile(userId: string): Promise<User> {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw new Error('Usuário não encontrado!')

    return user
  }

  async updateProfile(userId: string, data: UpdateUserInput): Promise<User> {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw new Error('Usuário não encontrado!')

    return prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
      },
    })
  }
}
