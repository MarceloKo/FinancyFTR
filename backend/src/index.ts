import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { buildSchema } from 'type-graphql'
import { expressMiddleware } from '@as-integrations/express5'
import { AuthResolver } from './resolvers/auth.resolver.js'
import { TransactionResolver } from './resolvers/transaction.resolver.js'
import { CategoryResolver } from './resolvers/category.resolver.js'
import { UserResolver } from './resolvers/user.resolver.js'
import { buildContext } from './graphql/context/index.js'

async function bootstrap() {
  const app = express()

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }))

  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      TransactionResolver,
      CategoryResolver,
      UserResolver,
    ],
    validate: false,
    emitSchemaFile: './schema.graphql',
  })

  const server = new ApolloServer({
    schema,
  })

  await server.start()

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: buildContext,
    })
  )

  app.listen(
    {
      port: 4000,
    },
    () => {
      console.log(`Servidor iniciado na porta 4000!`)
    }
  )
}

bootstrap()
