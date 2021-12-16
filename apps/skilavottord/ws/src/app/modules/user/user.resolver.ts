import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import {
  IdsUserGuard,
  CurrentUser,
  User as AuthenticatedUser,
} from '@island.is/auth-nest-tools'

import { User } from './user.model'

@UseGuards(IdsUserGuard)
@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  skilavottordUser(@CurrentUser() user: AuthenticatedUser): User {
    return user
  }
}
