import { Field, ObjectType } from 'type-graphql'
import { UserModel } from '../../models/user.model.js'

@ObjectType()
export class AuthOutput {
  @Field(() => String)
  token!: string

  @Field(() => UserModel)
  user!: UserModel
}
