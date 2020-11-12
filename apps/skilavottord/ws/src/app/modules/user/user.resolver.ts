import { Query, Resolver } from '@nestjs/graphql'
import { User } from './models'
import { Authorize, AuthService, CurrentUser, AuthUser } from '../auth'
import { Role } from '../auth/auth.types'
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

    currUser.role = RoleForUser
    if (currUser.role === 'recyclingCompany' || currUser.role === 'developer') {
      currUser.partnerId = '110' // This is parter Id for Vaka, to be fixed later
    } else {
      currUser.partnerId = null // This is parter Id for Vaka, to be fixed later
    }
    this.logger.info(
      `  - skilavottordUser returning  ${currUser.name} - ${currUser.nationalId} - ${currUser.mobile} - ${currUser.role} - ${currUser.partnerId}`,
    )
    this.logger.info(`--- skilavottordUser ending ---`)

    return currUser
  }
}
