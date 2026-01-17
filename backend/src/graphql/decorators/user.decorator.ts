import { createParameterDecorator, ResolverData } from 'type-graphql'
import { GraphqlContext } from '../context/index.js'
import { UserModel } from '../../models/user.model.js'
import { prismaClient } from '../../../prisma/prisma.js'

export const GqlUser = () => {
  return createParameterDecorator(
    async ({ context }: ResolverData<GraphqlContext>): Promise<UserModel | null> => {
      if (!context || !context.user) return null

      try {
        const user = await prismaClient.user.findUnique({
          where: {
            id: context.user,
          },
        })
        if (!user) throw new Error('Usuário não encontrado')
        return user
      } catch (error) {
        console.log('Erro ao instanciar o gqluser')
        return null
      }
    }
  )
}
