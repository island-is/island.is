import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Controller, Get, UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import { UserProfileScope } from '@island.is/auth/scopes'
import { UserProfileDto } from './dto/user-profileDto'
import { UserProfileService } from './user-profile.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(UserProfileScope.read)
@ApiTags('v2/me')
@ApiSecurity('oauth2', [UserProfileScope.read])
@Controller({
  path: 'me',
  version: ['2'],
})
@Audit({ namespace: '@island.is/user-profile/v2/me' })
export class MeUserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  @Documentation({
    description: 'Get user profile for the current user.',
    response: { status: 200, type: UserProfileDto },
  })
  @Audit<UserProfileDto>({
    resources: (profile) => profile.nationalId,
  })
  findUserProfile(@CurrentUser() user: User): Promise<UserProfileDto> {
    return this.userProfileService.findById(user.nationalId)
  }
}
