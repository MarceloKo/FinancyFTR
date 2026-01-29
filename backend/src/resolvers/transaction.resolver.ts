import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { TransactionModel } from '../models/transaction.model.js'
import { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input.js'
import { TransactionFilterInput } from '../dtos/input/transaction-filter.input.js'
import { PaginatedTransactionsOutput } from '../dtos/output/transaction.output.js'
import { TransactionService, TransactionWithCategory, PaginatedTransactions } from '../services/transaction.service.js'
import { IsAuth } from '../middlewares/auth.middleware.js'
import { GqlUser } from '../graphql/decorators/user.decorator.js'
import { UserModel } from '../models/user.model.js'

@Resolver()
export class TransactionResolver {
  private transactionService = new TransactionService()

  @Query(() => PaginatedTransactionsOutput)
  @UseMiddleware(IsAuth)
  async listTransactions(
    @GqlUser() user: UserModel,
    @Arg('filters', () => TransactionFilterInput, { nullable: true }) filters?: TransactionFilterInput
  ): Promise<PaginatedTransactions> {
    return this.transactionService.listTransactions(user.id, filters)
  }

  @Query(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async getTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<TransactionWithCategory> {
    return this.transactionService.getTransaction(id, user.id)
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: UserModel
  ): Promise<TransactionWithCategory> {
    return this.transactionService.createTransaction(data, user.id)
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async updateTransaction(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
    @GqlUser() user: UserModel
  ): Promise<TransactionWithCategory> {
    return this.transactionService.updateTransaction(id, data, user.id)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async deleteTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<boolean> {
    return this.transactionService.deleteTransaction(id, user.id)
  }
}
