import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { UserProfileScope } from '@island.is/auth/scopes'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import { UserProfileService } from './user-profile.service'
import { UserProfileDto } from './dto/user-profileDto'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { PatchUserProfileDto } from './dto/patch-user-profileDto'

const namespace = '@island.is/apps/services/user-profile/v2/me'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(UserProfileScope.read)
@ApiTags('user-profile')
@ApiSecurity('oauth2', [UserProfileScope.read])
@Controller({
  path: 'me/user-profile',
  version: ['2'],
})
@Audit({ namespace })
export class MeUserProfileController {
  constructor(
    private readonly auditService: AuditService,
    private readonly userProfileService: UserProfileService,
  ) {}

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

  @Patch()
  @Documentation({
    description: 'Update user profile for the current user.',
    response: { status: 201, type: UserProfileDto },
  })
  @Audit<UserProfileDto>({
    resources: (profile) => profile.nationalId,
  })
  @Scopes(UserProfileScope.write)
  patchUserProfile(
    @CurrentUser() user: User,
    @Body() userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    return this.userProfileService.patch(user.nationalId, userProfile)
  }

  @Post('/confirm')
  @Scopes(UserProfileScope.write)
  @Documentation({
    description: 'Confirms that the user has seen the nudege',
    response: { status: 201 },
  })
  confirmNudge(@CurrentUser() user: User) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'confirm',
        resources: user.nationalId,
        alsoLog: true,
      },
      this.userProfileService.confirmNudge(user.nationalId),
    )
  }
}
