import { Query, Resolver } from '@nestjs/graphql'

import { Authorize } from './auth.guard'
import { CurrentUser } from './currentUser.decorator'
import { User } from './user.model'

@Authorize()
@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  skilavottordUser(@CurrentUser() user: User): User {
    return user as User
  }
}
