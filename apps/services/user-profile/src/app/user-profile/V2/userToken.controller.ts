import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import {
  Controller,
  Get,
  UseGuards,
  Headers,
  Delete,
  Param, Post, Body, BadRequestException,
} from '@nestjs/common'

import { CurrentUser, IdsAuthGuard, Scopes, ScopesGuard, type User } from '@island.is/auth-nest-tools'
import { UserProfileScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { UserTokenService } from './userToken.service'
import { UserDeviceTokenDto } from './dto/userDeviceToken.dto'
import { DeviceTokenDto } from './dto/deviceToken.dto'
import { UserProfileService } from './user-profile.service'

const namespace = '@island.is/user-profile/v2/userTokens'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(UserProfileScope.admin)
@ApiTags('v2/users')
@ApiSecurity('oauth2', [UserProfileScope.admin])
@Controller({
  path: 'users/.nationalId/device-tokens',
  version: ['2'],
})
@Audit({ namespace })
export class UserTokenController {
  constructor(private readonly userTokenService: UserTokenService, private readonly userProfileService: UserProfileService) {}

  @Get()
  @Documentation({
    description: 'Get user device tokens for given nationalId.',
    request: {
      header: {
        'X-Param-National-Id': {
          required: true,
          description: 'National id of the owner of the device tokens',
        },
      },
    },
    response: { status: 200, type: [UserDeviceTokenDto] },
  })
  @Audit<UserDeviceTokenDto[]>({
    resources: (profile) => profile.map((p) => p.id),
  })
  findUserDeviceToken(
    @Headers('X-Param-National-Id') nationalId: string,
  ): Promise<UserDeviceTokenDto[]> {
    return this.userTokenService.findAllUserTokensByNationalId(nationalId)
  }

  @Delete(':deviceToken')
  @Documentation({
    description: 'Delete a user device token.',
    response: { status: 204 },
  })
  @Audit({
    resources: (deviceToken: string) => deviceToken,
  })
  async deleteUserDeviceToken(
    @Headers('X-Param-National-Id') nationalId: string,
    @Param('deviceToken') deviceToken: string,
  ): Promise<void> {
    await this.userTokenService.deleteUserTokenByNationalId(
      nationalId,
      deviceToken,
    )
  }

  @Post()
  @ApiOperation({
    summary: 'Adds a device token for notifications for a user device ',
  })
  @ApiOkResponse({ type: UserDeviceTokenDto })
  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Audit({
    resources: (deviceToken: string) => deviceToken,
  })
  async addDeviceToken(
    @Headers('X-Param-National-Id') nationalId: string,
    @CurrentUser() user: User,
    @Body() body: DeviceTokenDto,
  ): Promise<UserDeviceTokenDto> {
    if (nationalId != user.nationalId) {
      throw new BadRequestException()
    } else {

      await this.userProfileService.patch(
        {
          nationalId,
        },
        {},
      )
      // The behaviour of returning the token if it already exists is not following API Design Guide
      // It should respond with 303 See Other and a Location header to the existing resource
      // But as the v1 of the user profile is not following this, we will keep the same behaviour.
      return this.userTokenService.addDeviceToken(body.deviceToken, user)
    }
  }
}
