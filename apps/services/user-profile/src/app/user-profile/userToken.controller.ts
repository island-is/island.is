import { UserProfileScope } from '@island.is/auth/scopes'
import { Scopes, ScopesGuard, IdsAuthGuard } from '@island.is/auth-nest-tools'
import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'

import { UserDeviceTokenDto } from './dto/userDeviceToken.dto'
import { UserProfileService } from './userProfile.service'
import { UserProfile } from './userProfile.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('User Profile')
@Controller()
export class UserTokenController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly userProfileService: UserProfileService,
  ) {}
  @ApiOperation({
    summary: 'admin access - returns a list of user device tokens',
  })
  @ApiOkResponse({ type: [UserDeviceTokenDto] })
  @Scopes(UserProfileScope.admin)
  @ApiSecurity('oauth2', [UserProfileScope.admin])
  @Get('userProfile/:nationalId/device-tokens')
  async getDeviceTokens(
    @Param('nationalId')
    nationalId: string,
  ): Promise<UserDeviceTokenDto[]> {
    return await this.userProfileService.getDeviceTokens(nationalId)
  }

  @ApiOperation({
    summary: 'admin access - returns user profile settings',
  })
  @Scopes(UserProfileScope.admin)
  @ApiSecurity('oauth2', [UserProfileScope.admin])
  @Get('userProfile/:nationalId/notification-settings')
  @ApiOkResponse({ type: UserProfile })
  async findOneByNationalId(
    @Param('nationalId')
    nationalId: string,
  ): Promise<UserProfile> {
    const userProfile = await this.userProfileService.findByNationalId(
      nationalId,
    )
    if (!userProfile) {
      this.logger.info(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    } else {
      this.logger.info(`Found user profile with nationalId ${nationalId}`)
    }
    return userProfile
  }
}
