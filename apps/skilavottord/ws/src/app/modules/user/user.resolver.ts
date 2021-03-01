import { Query, Resolver } from '@nestjs/graphql'
import { User } from './models'
import { Authorize, AuthService, CurrentUser, AuthUser } from '../auth'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Inject } from '@nestjs/common'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private authService: AuthService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => User, { nullable: true })
  skilavottordUser(@CurrentUser() user: AuthUser): User {
    this.logger.info('--- skilavottordUser starting ---')
    if (!user) {
      this.logger.info('  - User does not exist')
      return null
    }
    this.logger.info('  - User exists')
    const currUser = new User()
    currUser.nationalId = user.nationalId
    currUser.name = user.name
    currUser.mobile = user.mobile
    const roleUser: AuthUser = {
      nationalId: user.nationalId,
      mobile: user.mobile,
      name: user.name,
    }
    const userRole = this.authService.getUserRole(roleUser)
    if (!userRole) {
      currUser.role = 'citizen'
    } else {
      currUser.partnerId = userRole.partnerId
      currUser.role = userRole.role
    }
    this.logger.info('--- skilavottordUser:' + JSON.stringify(currUser))
    this.logger.info('--- skilavottordUser ending ---')
    return currUser
  }
}
