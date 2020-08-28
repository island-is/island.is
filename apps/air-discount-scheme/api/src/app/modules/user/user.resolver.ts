import { Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'

import { User as TUser } from '@island.is/air-discount-scheme/types'
import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { User } from './models'

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

  @ResolveField('meetsADSRequirements')
  resolveMeetsADSRequirements(@Parent() user: TUser): boolean {
    if (user.fund) {
      return user.fund.credit === user.fund.total - user.fund.used
    }

    return false
  }
}
