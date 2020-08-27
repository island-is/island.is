import { Query, Resolver, ResolveField } from '@nestjs/graphql'

import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { User } from './user.model'

@Resolver(() => User)
export class UserResolver {
  constructor(private authService: AuthService) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => User, { nullable: true })
  user(@CurrentUser() user: AuthUser): User {
    if (!user) {
      return null
    }

    return user as User
  }

  @Authorize({ throwOnUnAuthorized: false })
  @ResolveField('role')
  resolveRole(@CurrentUser() user: AuthUser): string {
    return this.authService.getRole(user)
  }
}
