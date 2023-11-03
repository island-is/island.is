import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Headers,
  BadRequestException,
} from '@nestjs/common'

import { Documentation } from '@island.is/nest/swagger'
import { Audit, AuditService } from '@island.is/nest/audit'
import { UserProfileScope } from '@island.is/auth/scopes'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

import { UserProfileDto } from './dto/user-profileDto'
import { UserProfileService } from './user-profile.service'

const namespace = '@island.is/user-profile/v2/users'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(UserProfileScope.system)
@ApiTags('v2/users')
@ApiSecurity('oauth2', [UserProfileScope.system])
@Controller({
  path: 'users',
  version: ['2'],
})
@Audit({ namespace })
export class UserProfileController {
  constructor(
    private readonly auditService: AuditService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Get('/.national-id')
  @Documentation({
    description: 'Get user profile for given nationalId.',
    response: { status: 200, type: UserProfileDto },
  })
  @Audit<UserProfileDto>({
    resources: (profile) => profile.nationalId,
  })
  findUserProfile(
    @Headers('X-Param-National-Id') nationalId: string,
  ): Promise<UserProfileDto> {
    if (!nationalId || nationalId.length !== 10) {
      throw new BadRequestException('National id is not valid')
    }
    return this.userProfileService.findById(nationalId)
  }
}
