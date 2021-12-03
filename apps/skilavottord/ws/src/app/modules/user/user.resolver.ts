import { Query, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Authorize, AuthService, CurrentUser, Role } from '../auth'
import type { AuthUser } from '../auth'
import { User } from './user.model'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => User)
export class UserResolver {
  constructor(
    private authService: AuthService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Query(() => User, { nullable: true })
  skilavottordUser(@CurrentUser() user: AuthUser): User {
    this.logger.info(`--- skilavottordUser starting ---`)
    if (!user) {
      this.logger.info(`  - User does not exist`)
      return null
    }
    this.logger.info(`  - User exists`)
    const currUser = new User()

    currUser.nationalId = user.nationalId
    currUser.name = user.name
    currUser.mobile = user.mobile

    const authService = new AuthService()

    const RoleUser: AuthUser = {
      nationalId: user.nationalId,
      mobile: user.mobile,
      name: user.name,
    }

    let RoleForUser: Role = 'citizen' // citizen is the deault role
    RoleForUser = authService.getRole(RoleUser)

    //TODO: test
    currUser.partnerId = authService.getPartnerId(currUser.nationalId)
    currUser.role = RoleForUser

    this.logger.info(`--- skilavottordUser ending ---`)

    return currUser
  }
}
