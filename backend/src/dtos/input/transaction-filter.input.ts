import { Field, InputType, Int } from 'type-graphql'
import { TransactionType } from '../../models/transaction.model.js'

@InputType()
export class TransactionFilterInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number
}
