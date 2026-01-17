import { Arg, Mutation, Resolver } from 'type-graphql'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input.js'
import { AuthOutput } from '../dtos/output/auth.output.js'
import { AuthService } from '../services/auth.service.js'

@Resolver()
export class AuthResolver {
  private authService = new AuthService()

  @Mutation(() => AuthOutput)
  async login(
    @Arg('data', () => LoginInput) data: LoginInput
  ): Promise<AuthOutput> {
    return this.authService.login(data)
  }

  @Mutation(() => AuthOutput)
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput
  ): Promise<AuthOutput> {
    return this.authService.register(data)
  }
}
