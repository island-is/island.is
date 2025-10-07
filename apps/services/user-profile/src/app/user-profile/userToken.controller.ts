import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import {
  Controller,
  Get,
  UseGuards,
  Headers,
  Delete,
  Param,
} from '@nestjs/common'

import {
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { UserProfileScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { UserTokenService } from './userToken.service'
import { UserDeviceTokenDto } from './dto/userDeviceToken.dto'

const namespace = '@island.is/user-profile/v2/userTokens'

@ApiTags('v2/users')
@Controller({
  path: 'users/.nationalId/device-tokens',
  version: ['2'],
})
@Audit({ namespace })
export class UserTokenController {
  constructor(
    private readonly userTokenService: UserTokenService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @UseGuards(IdsAuthGuard, ScopesGuard)
  @Scopes(UserProfileScope.admin)
  @ApiSecurity('oauth2', [UserProfileScope.admin])
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
  async deleteUserDeviceToken(
    @Headers('X-Param-National-Id') nationalId: string,
    @Param('deviceToken') deviceToken: string,
    @CurrentUser() user?: User,
  ): Promise<void> {
    return this.auditService.auditPromise<void>(
      {
        auth:
          user ??
          ({
            actor: 'unauthenticated',
            scope: [],
            authorization: '',
            client: '',
          } as any),
        action: 'deleteUserDeviceToken',
        namespace,
        resources: deviceToken,
      },
      (async () => {
        await this.userTokenService.deleteUserTokenByNationalId(
          nationalId,
          deviceToken,
        )
      })(),
    )
  }
}
