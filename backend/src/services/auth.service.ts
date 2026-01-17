import { User } from '@prisma/client'
import { UserModel } from '../models/user.model.js'
import { prismaClient } from '../../prisma/prisma.js'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input.js'
import { comparePassword, hashPassword } from '../utils/hash.js'
import { signJwt } from '../utils/jwt.js'
import { AuthOutput } from '../dtos/output/auth.output.js'

export class AuthService {
  async login(data: LoginInput): Promise<AuthOutput> {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    })
    if (!existingUser) throw new Error('Usuário não cadastrado!')
    const compare = await comparePassword(data.password, existingUser.password)
    if (!compare) throw new Error('Senha inválida!')
    return this.generateTokens(existingUser)
  }

  async register(data: RegisterInput): Promise<AuthOutput> {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    })
    if (existingUser) throw new Error('E-mail já cadastrado!')

    const hash = await hashPassword(data.password)

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
      },
    })
    return this.generateTokens(user)
  }

  private generateTokens(user: User): AuthOutput {
    const token = signJwt({ id: user.id, email: user.email }, '1d')
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    }
  }
}
