import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import { UserProfileScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'

import { UserProfileDto } from './dto/user-profileDto'
import { UserProfileService } from './user-profile.service'
import { PatchUserProfileDto } from './dto/patch-user-profileDto'
import { CreateVerificationDto } from './dto/create-verificationDto'

const namespace = '@island.is/user-profile/v2/me'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(UserProfileScope.read)
@ApiTags('v2/me')
@ApiSecurity('oauth2', [UserProfileScope.read])
@Controller({
  path: 'me',
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
  @Post('/create-verification')
  @Scopes(UserProfileScope.write)
  @Documentation({
    description: 'Creates a verification for the user for either email or sms',
    response: { status: 201 },
  })
  async createVerification(
    @CurrentUser() user: User,
    @Body() input: CreateVerificationDto,
  ) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'create-verification',
        resources: user.nationalId,
        alsoLog: true,
      },
      (async (userProfileService: UserProfileService) => {
        if (input.email && !input.mobilePhoneNumber) {
          await userProfileService.createEmailVerification({
            nationalId: user.nationalId,
            email: input.email,
          })
        } else if (input.mobilePhoneNumber && !input.email) {
          await userProfileService.createSmsVerification({
            nationalId: user.nationalId,
            mobilePhoneNumber: input.mobilePhoneNumber,
          })
        } else {
          throw new BadRequestException(
            'Either email or mobile phone number must be provided',
          )
        }
      })(this.userProfileService),
    )
  }

  @Post('/nudge')
  @Scopes(UserProfileScope.write)
  @Documentation({
    description: 'Confirms that the user has seen the nudge',
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
