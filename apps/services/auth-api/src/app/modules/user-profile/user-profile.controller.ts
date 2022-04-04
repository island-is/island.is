import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { UserProfileDTO, UserProfileService } from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('user-profile')
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ type: UserProfileDTO })
  async userProfile(@CurrentUser() user: User): Promise<UserProfileDTO> {
    return this.userProfileService.getUserProfileClaims(user)
  }

  @Scopes('@identityserver.api/authentication')
  @Get('individual')
  @ApiOkResponse({ type: UserProfileDTO })
  async individualUserProfile(
    @CurrentUser() user: User,
  ): Promise<UserProfileDTO> {
    return this.userProfileService.getIndividualUserProfileClaims(user)
  }
}
