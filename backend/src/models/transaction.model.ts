import { Field, Float, GraphQLISODateTime, ID, ObjectType, registerEnumType } from 'type-graphql'
import { CategoryModel } from './category.model.js'

export enum TransactionType {
  income = 'income',
  expense = 'expense',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: 'Type of transaction',
})

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => Float)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel

  @Field(() => String)
  userId!: string

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
