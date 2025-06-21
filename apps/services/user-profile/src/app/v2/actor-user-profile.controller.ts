import type { User } from '@island.is/auth-nest-tools'
import {
  ActorScopes,
  CurrentActor,
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { UserProfileScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { ActorLocale } from '../user-profile/dto/actorLocale'
import { Locale } from '../user-profile/types/localeTypes'
import {
  ActorProfileEmailDto,
  UpdateActorProfileEmailDto,
} from './dto/actor-profile-email.dto'
import {
  ActorProfileDetailsDto,
  MeActorProfileDto,
  PaginatedActorProfileDto,
  PatchActorProfileDto,
} from './dto/actor-profile.dto'
import { CreateVerificationDto } from './dto/create-verification.dto'
import { PostNudgeDto } from './dto/post-nudge.dto'
import { SetActorProfileEmailDto } from './dto/set-actor-profile-email.dto'
import { UserProfileService } from './user-profile.service'

const namespace = '@island.is/user-profile/v2/actor'
@UseGuards(IdsUserGuard, ScopesGuard)
@ActorScopes(UserProfileScope.read)
@ApiTags('v2/actor')
@ApiSecurity('oauth2', [UserProfileScope.read])
@Controller({
  path: 'actor',
  version: ['2'],
})
@Audit({ namespace })
export class ActorUserProfileController {
  constructor(
    private readonly auditService: AuditService,
    private readonly userProfileService: UserProfileService,
  ) {}
  @Get('/locale')
  @ApiOkResponse({ type: ActorLocale })
  @ApiNoContentResponse()
  @Audit<ActorLocale>({
    resources: (profile) => profile.nationalId,
  })
  async getActorLocale(@CurrentActor() actor: User): Promise<ActorLocale> {
    const userProfile = await this.userProfileService.findById(actor.nationalId)
    return {
      nationalId: userProfile.nationalId,
      locale: userProfile.locale ?? Locale.ICELANDIC,
    }
  }

  @Get('/actor-profile')
  @Documentation({
    description:
      'Get a single actor profile with detailed information for the current user and specified fromNationalId.',
    response: { status: 200, type: ActorProfileDetailsDto },
  })
  @Audit<ActorProfileDetailsDto>({
    resources: (profile) => profile.nationalId,
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

  @Post('/actor-profile/nudge')
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
  @Documentation({
    description: 'Get details for all actor profiles for the current user.',
    response: { status: 200, type: PaginatedActorProfileDto },
  })
  getActorProfiles(
    @CurrentUser() user: User,
  ): Promise<PaginatedActorProfileDto> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'getActorProfiles',
        resources: user.nationalId,
      },
      this.userProfileService.getActorProfiles(user.nationalId),
    )
  }

  @Patch('/actor-profile/email')
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

  @Post('/create-verification')
  @Documentation({
    description:
      'Creates a verification code for the user for either email or sms',
    response: { status: 200 },
  })
  async createVerification(
    @CurrentActor() actor: User,
    @Body() input: CreateVerificationDto,
  ) {
    const validateInputs = async () => {
      if (input.email && !input.mobilePhoneNumber) {
        await this.userProfileService.createEmailVerification({
          nationalId: actor.nationalId,
          email: input.email,
        })
      } else if (input.mobilePhoneNumber && !input.email) {
        await this.userProfileService.createSmsVerification({
          nationalId: actor.nationalId,
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
        auth: actor,
        namespace,
        action: 'createVerification',
        resources: actor.nationalId,
      },
      validateInputs(),
    )
  }

  @Patch('/actor-profile/set-email-by-id/.from-national-id')
  @Documentation({
    description: 'Update an actor profile with email id for the current user',
    response: { status: 200, type: ActorProfileDetailsDto },
  })
  updateActorProfileEmailById(
    @CurrentUser() user: User,
    @Headers('X-Param-From-National-Id') fromNationalId: string,
    @Body() dto: SetActorProfileEmailDto,
  ): Promise<ActorProfileDetailsDto> {
    if (!user.actor?.nationalId) {
      throw new BadRequestException('User has no actor profile')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'updateActorProfileEmailById',
        resources: `${user.nationalId}:${user.actor.nationalId}`,
        meta: {
          emailsId: dto.emailsId,
        },
      },
      this.userProfileService.setActorProfileEmail({
        toNationalId: user.nationalId,
        fromNationalId,
        emailsId: dto.emailsId,
      }),
    )
  }

  @Patch('/actor-profiles/.from-national-id')
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
    @CurrentActor() actor: User,
    @Headers('X-Param-From-National-Id') fromNationalId: string,
    @Body() actorProfile: PatchActorProfileDto,
  ): Promise<MeActorProfileDto> {
    return this.auditService.auditPromise(
      {
        auth: actor,
        namespace,
        action: 'patch',
        resources: actor.nationalId,
        meta: {
          fromNationalId,
          fields: Object.keys(actorProfile),
        },
      },
      this.userProfileService.createOrUpdateActorProfile({
        toNationalId: actor.nationalId,
        fromNationalId,
        emailNotifications: actorProfile.emailNotifications,
        emailsId: actorProfile.emailsId,
      }),
    )
  }

  @Patch('/actor-profile')
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
}
