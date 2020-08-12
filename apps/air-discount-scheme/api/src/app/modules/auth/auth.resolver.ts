import { Args, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { Auth } from './auth.model'
import { AuthInput } from './dto/auth.input'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => Auth)
  auth(@Args('input') input: AuthInput): Auth {
    const message = this.authService.getMessage(input?.name ?? 'World')
    return { message }
  }
}
