import { Query, Resolver } from '@nestjs/graphql'

import { Authorize, CurrentUser } from '../auth'
import type { AuthUser } from '../auth'
import { User } from './user.model'
import { UserService } from './user.service'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { nullable: true })
  skilavottordUser(@CurrentUser() user: AuthUser): Promise<User> {
    return this.userService.getUser(user)
  }
}
