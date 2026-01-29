import { Field, Int, ObjectType } from 'type-graphql'
import { TransactionModel } from '../../models/transaction.model.js'

@ObjectType()
export class PaginatedTransactionsOutput {
  @Field(() => [TransactionModel])
  transactions!: TransactionModel[]

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  limit!: number

  @Field(() => Int)
  totalPages!: number
}
