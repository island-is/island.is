import { UserProfileScope } from '@island.is/auth/scopes'
import { Scopes, ScopesGuard, IdsAuthGuard } from '@island.is/auth-nest-tools'
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'

import { UserDeviceTokenDto } from './dto/userDeviceToken.dto'
import { UserProfileService } from './userProfile.service'
import { UserProfile } from './userProfile.model'
import { CreateNotificationDto } from './dto/createNotificationDto'

import { Documentation } from '@island.is/nest/swagger'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('User Profile')
@Controller()
export class UserTokenController {
  constructor(private readonly userProfileService: UserProfileService) {}
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
      throw new NotFoundException(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    }
    return userProfile
  }

  // focus on getting this one done ....
  @Post('userProfile/:nationalId/magic-bell-notification')
  @Scopes(UserProfileScope.admin)
  @ApiSecurity('oauth2', [UserProfileScope.admin])
  @Documentation({
    summary: 'admin access - tests magicbell',
    description: 'admin access - tests magicbell',
    response: { status: 201, type: CreateNotificationDto },
    request: {
      query: {},
      params: {
        nationalId: {
          type: 'string',
          description: 'ID of the user',
        },
      },
    },
  })
  async notifyViaMagicBell(
    @Param('nationalId')
    nationalId: string,
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<{}> {
    return await this.userProfileService.notifyViaMagicBell(
      nationalId,
      createNotificationDto,
    )
  }

  // maybe do this if we have time ................
  @Post('userProfile/:nationalId/one-signal-notification')
  @Scopes(UserProfileScope.admin)
  @ApiSecurity('oauth2', [UserProfileScope.admin])
  @Documentation({
    summary: 'admin access - tests onesignal',
    description: 'admin access - tests onesignal',
    response: { status: 201, type: CreateNotificationDto },
    request: {
      query: {},
      params: {
        nationalId: {
          type: 'string',
          description: 'ID of the user',
        },
      },
    },
  })
  async notifyViaOneSignal(
    @Param('nationalId')
    nationalId: string,
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<{}> {
    return await this.userProfileService.notifyViaOneSignal(
      nationalId,
      createNotificationDto,
    )
  }
}
