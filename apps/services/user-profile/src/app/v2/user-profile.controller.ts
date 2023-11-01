import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { Documentation } from '@island.is/nest/swagger'
import { Audit, AuditService } from '@island.is/nest/audit'
import { UserProfileScope } from '@island.is/auth/scopes'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

import { UserProfileDto } from './dto/user-profileDto'
import { UserProfileService } from './user-profile.service'

const namespace = '@island.is/user-profile/v2/user'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(UserProfileScope.system)
@ApiTags('v2/user')
@ApiSecurity('oauth2', [UserProfileScope.system])
@Controller({
  path: 'user',
  version: ['2'],
})
@Audit({ namespace })
export class UserProfileController {
  constructor(
    private readonly auditService: AuditService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Get('/:nationalId')
  @Documentation({
    description: 'Get user profile for given nationalId.',
    response: { status: 200, type: UserProfileDto },
  })
  @Audit<UserProfileDto>({
    resources: (profile) => profile.nationalId,
  })
  findUserProfile(
    @Param('nationalId') nationalId: string,
  ): Promise<UserProfileDto> {
    return this.userProfileService.findById(nationalId)
  }
}
