import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope, UserProfileScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { ClientType } from '../types/ClientType'
import {
  ActorProfileEmailDto,
  UpdateActorProfileEmailDto,
} from './dto/actor-profile-email.dto'
import {
  ActorProfileDetailsDto,
  PaginatedActorProfileDto,
} from './dto/actor-profile.dto'
import { PatchUserProfileDto } from './dto/patch-user-profile.dto'
import { PostNudgeDto } from './dto/post-nudge.dto'
import { SetActorProfileEmailDto } from './dto/set-actor-profile-email.dto'
import { UserProfileDto } from './dto/user-profile.dto'
import { UserProfileService } from './user-profile.service'
import { CreateVerificationDto } from './dto/create-verification.dto'

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
  async findUserProfile(@CurrentUser() user: User): Promise<UserProfileDto> {
    return this.userProfileService.findById(
      user.nationalId,
      false,
      ClientType.FIRST_PARTY,
    )
  }

  @Patch()
  @Documentation({
    description: 'Update user profile for the current user.',
    response: { status: 200, type: UserProfileDto },
  })
  @Scopes(UserProfileScope.write)
  patchUserProfile(
    @CurrentUser() user: User,
    @Body() userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'patch',
        resources: user.nationalId,
        meta: {
          fields: Object.keys(userProfile),
        },
      },
      this.userProfileService.patch(user, userProfile),
    )
  }

  @Post('/nudge')
  @Scopes(UserProfileScope.write)
  @Documentation({
    description:
      'Confirms that the user has seen the nudge from a specific screen. Allowed screens are defined in NudgeFrom enum.',
    response: { status: 200 },
  })
  confirmNudge(@CurrentUser() user: User, @Body() input: PostNudgeDto) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'nudge',
        resources: user.nationalId,
      },
      this.userProfileService.confirmNudge(user.nationalId, input.nudgeType),
    )
  }

  @Get('/actor-profiles')
  @Scopes(ApiScope.internal)
  @Documentation({
    description: 'Get actor profiles for the current user.',
    response: { status: 200, type: PaginatedActorProfileDto },
  })
  @Audit<PaginatedActorProfileDto>({
    resources: (profiles) =>
      profiles.data.map((profile) => profile.fromNationalId),
  })
  getActorProfiles(
    @CurrentUser() user: User,
  ): Promise<PaginatedActorProfileDto> {
    return this.userProfileService.getActorProfiles(user.nationalId)
  }

  @Patch('emails/:emailId/primary')
  @Scopes(UserProfileScope.write)
  @Documentation({
    description:
      'Sets the email associated with the provided emailId as the primary email.',
    response: { status: 200, type: UserProfileDto },
  })
  setEmailAsPrimary(
    @CurrentUser() user: User,
    @Param('emailId') emailId: string,
  ): Promise<UserProfileDto> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'setEmailAsPrimary',
        resources: user.nationalId,
        meta: {
          emailId,
        },
      },
      this.userProfileService.setEmailAsPrimary(user.nationalId, emailId),
    )
  }

  @Post('/create-verification')
  @Documentation({
    description:
      'Creates a verification code for the user for either email or sms',
    response: { status: 200 },
  })
  async createVerification(
    @CurrentUser() user: User,
    @Body() input: CreateVerificationDto,
  ) {
    const validateInputs = async () => {
      if (input.email && !input.mobilePhoneNumber) {
        await this.userProfileService.createEmailVerification({
          nationalId: user.nationalId,
          email: input.email,
        })
      } else if (input.mobilePhoneNumber && !input.email) {
        await this.userProfileService.createSmsVerification({
          nationalId: user.nationalId,
          mobilePhoneNumber: input.mobilePhoneNumber,
        })
      } else {
        throw new BadRequestException(
          'Either email or mobile phone number must be provided',
        )
      }
    }
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'createVerification',
        resources: user.nationalId,
      },
      validateInputs(),
    )
  }

  @Patch('/actor-profile/.from-national-id')
  @Scopes(ApiScope.internal)
  @Documentation({
    request: {
      header: {
        'X-Param-From-National-Id': {
          required: true,
          description: 'National id of the user that granted the delegation',
        },
      },
    },
    description:
      'Update or create an actor profile with email information for the current user',
    response: {
      status: 200,
      type: ActorProfileEmailDto,
    },
  })
  updateActorProfileEmail(
    @CurrentUser() user: User,
    @Headers('X-Param-From-National-Id') fromNationalId: string,
    @Body() actorProfile: UpdateActorProfileEmailDto,
  ): Promise<ActorProfileEmailDto> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'updateActorProfileEmail',
        resources: user.nationalId,
        meta: {
          fields: Object.keys(actorProfile),
        },
      },
      this.userProfileService.updateActorProfileEmail({
        toNationalId: user.nationalId,
        fromNationalId,
        ...actorProfile,
      }),
    )
  }

  @Patch('/actor-profile/email')
  @Scopes(UserProfileScope.write)
  @Documentation({
    description:
      'Set an email ID on an actor profile and reset the nudge timer',
    response: {
      status: 200,
      type: ActorProfileDetailsDto,
    },
  })
  setActorProfileEmail(
    @CurrentUser() user: User,
    @Body() dto: SetActorProfileEmailDto,
  ): Promise<ActorProfileDetailsDto> {
    if (!user.actor?.nationalId) {
      throw new BadRequestException('User has no actor profile')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'setActorProfileEmail',
        resources: `${user.nationalId}:${user.actor.nationalId}`,
        meta: {
          emailsId: dto.emailsId,
        },
      },
      this.userProfileService.setActorProfileEmail({
        toNationalId: user.actor.nationalId,
        fromNationalId: user.nationalId,
        emailsId: dto.emailsId,
      }),
    )
  }

  @Patch('/actor-profile/set-email-by-id/.from-national-id')
  @Scopes(ApiScope.internal)
  @Documentation({
    description: 'Update an actor profile with email id for the current user',
    response: { status: 200, type: ActorProfileDetailsDto },
  })
  setActorProfileEmailById(
    @CurrentUser() user: User,
    @Headers('X-Param-From-National-Id') fromNationalId: string,
    @Body() body: SetActorProfileEmailDto,
  ): Promise<ActorProfileDetailsDto> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'updateActorProfileEmailById',
        resources: `${user.nationalId}:${fromNationalId}`,
        meta: {
          emailsId: body.emailsId,
        },
      },
      this.userProfileService.setActorProfileEmail({
        toNationalId: user.nationalId,
        fromNationalId,
        emailsId: body.emailsId,
      }),
    )
  }
}
