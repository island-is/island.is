import { Query, Resolver } from '@nestjs/graphql'

import { Authorize, CurrentUser, AuthService } from '../auth'
import { User as UserModel } from './user.model'
import { User } from './user.types'

@Resolver()
export class UserResolver {
  constructor(private authService: AuthService) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => UserModel, { nullable: true })
  user(@CurrentUser() user: User): UserModel {
    if (!user) {
      return null
    }

    return { ...user, role: this.authService.getRole(user) }
  }
}
