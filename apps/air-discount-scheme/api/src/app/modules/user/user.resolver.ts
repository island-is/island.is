import { Args, Query, Resolver } from '@nestjs/graphql'

import { Authorize, CurrentUser, AuthService } from '../auth'
import { User } from './user.model'

@Resolver()
export class UserResolver {
  constructor(private authService: AuthService) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => User, { nullable: true })
  user(@CurrentUser() user): User {
    if (!user) {
      return null
    }

    return { ...user, role: this.authService.getRole(user) }
  }
}
