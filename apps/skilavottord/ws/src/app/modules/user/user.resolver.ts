import { Query, Resolver } from '@nestjs/graphql'

import { Authorize, CurrentUser } from '../auth'
import type { User as AuthenticatedUser } from '../auth'
import { User } from './user.model'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  skilavottordUser(@CurrentUser() user: AuthenticatedUser): User {
    return user
  }
}
