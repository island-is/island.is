import { Controller, Get, UseGuards, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'

import { UserProfileService } from './user-profile.service'
import { UserProfileDTO } from './dto/user-profile.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('user-profile')
@Controller({
  path: 'user-profile',
  version: ['1', VERSION_NEUTRAL],
})
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @Documentation({
    response: { type: UserProfileDTO },
  })
  async userProfile(@CurrentUser() user: User): Promise<UserProfileDTO> {
    const fetchUserProfileClaims = await this.featureFlagService.getValue(
      Features.userProfileClaims,
      false,
      { id: user.nationalId },
    )
    return this.userProfileService.getUserProfileClaims(
      user,
      fetchUserProfileClaims,
    )
  }

  @Scopes('@identityserver.api/authentication')
  @Get('individual')
  @Documentation({
    response: { type: UserProfileDTO },
    description: 'Use /user-profile instead.',
    deprecated: true,
  })
  async individualUserProfile(
    @CurrentUser() user: User,
  ): Promise<UserProfileDTO> {
    return this.userProfile(user)
  }
}
