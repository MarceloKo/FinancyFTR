import { Field, Float, InputType } from 'type-graphql'
import { TransactionType } from '../../models/transaction.model.js'

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  title!: string

  @Field(() => Float)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => Date)
  date!: Date

  @Field(() => String, { nullable: true })
  categoryId?: string
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => String, { nullable: true })
  categoryId?: string
}
