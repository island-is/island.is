import { ApiSecurity, ApiTags } from '@nestjs/swagger'
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

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import { ApiScope, UserProfileScope } from '@island.is/auth/scopes'

import { CreateVerificationDto } from './dto/create-verification.dto'
import { PatchUserProfileDto } from './dto/patch-user-profile.dto'
import { UserProfileDto } from './dto/user-profile.dto'
import { UserProfileService } from './user-profile.service'
import { PostNudgeDto } from './dto/post-nudge.dto'
import { ClientType } from '../types/ClientType'
import {
  MeActorProfileDto,
  PaginatedActorProfileDto,
  PatchActorProfileDto,
  ActorProfileDetailsDto,
} from './dto/actor-profile.dto'
import {
  UpdateActorProfileEmailDto,
  ActorProfileEmailDto,
} from './dto/actor-profile-email.dto'
import { SetActorProfileEmailDto } from './dto/set-actor-profile-email.dto'

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

  @Post('/create-verification')
  @Scopes(UserProfileScope.write)
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

  @Post('/actor-profile/nudge')
  @Scopes(ApiScope.internal)
  @Documentation({
    description:
      'Confirms that the actor has seen the nudge. Updates the nextNudge date for the actor profile.',
    response: { status: 200 },
  })
  confirmActorProfileNudge(
    @CurrentUser() user: User,
    @Body() input: PostNudgeDto,
  ) {
    if (!user.actor?.nationalId) {
      throw new BadRequestException('User has no actor profile')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'actorProfileNudge',
        resources: `${user.nationalId}:${user.actor?.nationalId}`,
      },
      this.userProfileService.confirmActorProfileNudge({
        toNationalId: user.actor?.nationalId,
        fromNationalId: user.nationalId,
        nudgeType: input.nudgeType,
      }),
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

  @Get('/actor-profile')
  @Scopes(ApiScope.internal)
  @Documentation({
    description:
      'Get a single actor profile with detailed information for the current user and specified fromNationalId.',
    response: { status: 200, type: ActorProfileDetailsDto },
  })
  @Audit<ActorProfileDetailsDto>({
    resources: (profile) => profile.actorNationalId,
  })
  getSingleActorProfile(
    @CurrentUser() user: User,
  ): Promise<ActorProfileDetailsDto> {
    if (!user.actor?.nationalId) {
      throw new BadRequestException('User has no actor profile')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'getSingleActorProfile',
        resources: `${user.nationalId}:${user.actor.nationalId}`,
      },
      this.userProfileService.getSingleActorProfile({
        toNationalId: user.actor.nationalId,
        fromNationalId: user.nationalId,
      }),
    )
  }

  @Get('/actor-profiles/details')
  @Scopes(ApiScope.internal)
  @Documentation({
    description: 'Get details for all actor profiles for the current user.',
    response: { status: 200, type: PaginatedActorProfileDto },
  })
  getActorProfilesDetails(
    @CurrentUser() user: User,
  ): Promise<ActorProfileDetailsDto[]> {
    return this.userProfileService.getActorProfilesDetails(user.nationalId)
  }

  @Patch('/actor-profiles/.from-national-id')
  @Scopes(ApiScope.internal)
  @Documentation({
    description: 'Update or create an actor profile for the current user',
    request: {
      header: {
        'X-Param-From-National-Id': {
          required: true,
          description: 'National id of the user that granted the delegation',
        },
      },
    },
    response: { status: 200, type: MeActorProfileDto },
  })
  createOrUpdateActorProfile(
    @CurrentUser() user: User,
    @Headers('X-Param-From-National-Id') fromNationalId: string,
    @Body() actorProfile: PatchActorProfileDto,
  ): Promise<MeActorProfileDto> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'patch',
        resources: user.nationalId,
        meta: {
          fromNationalId,
          fields: Object.keys(actorProfile),
        },
      },
      this.userProfileService.createOrUpdateActorProfile({
        toNationalId: user.nationalId,
        fromNationalId,
        emailNotifications: actorProfile.emailNotifications,
        emailsId: actorProfile.emailsId,
      }),
    )
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

  @Patch('/actor-profile')
  @Scopes(ApiScope.internal)
  @Documentation({
    description:
      'Update or create an actor profile with email information for the current user',
    response: {
      status: 200,
      type: ActorProfileEmailDto,
    },
  })
  updateActorProfileEmail(
    @CurrentUser() user: User,
    @Body() actorProfile: UpdateActorProfileEmailDto,
  ): Promise<ActorProfileEmailDto> {
    if (!user.actor?.nationalId) {
      throw new BadRequestException('User has no actor profile')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'updateActorProfileEmail',
        resources: `${user.nationalId}:${user.actor.nationalId}`,
        meta: {
          fields: Object.keys(actorProfile),
        },
      },
      this.userProfileService.updateActorProfileEmail({
        toNationalId: user.actor.nationalId,
        fromNationalId: user.nationalId,
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
    console.log('dto', dto)
    if (!user.actor?.nationalId) {
      console.log('User has no actor profile')
      throw new BadRequestException('User has no actor profile')
    }
    console.log('User has actor profile')

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
}
