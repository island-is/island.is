import {
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger'
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
} from './dto/actor-profile.dto'
import { UserTokenService } from './userToken.service'
import { UserDeviceTokenDto } from './dto/userDeviceToken.dto'
import { DeviceTokenDto } from './dto/deviceToken.dto'

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
    private readonly userTokenService: UserTokenService,
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
      }),
    )
  }

  @Post('/device-tokens')
  @ApiOperation({
    summary: 'Adds a device token for notifications for a user device ',
  })
  @ApiOkResponse({ type: UserDeviceTokenDto })
  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Audit({
    resources: (deviceToken: string) => deviceToken,
  })
  async addDeviceToken(
    @CurrentUser() user: User,
    @Body() body: DeviceTokenDto,
  ): Promise<UserDeviceTokenDto> {
    await this.userProfileService.patch(
      {
        nationalId: user.nationalId,
      },
      {},
    )
    // The behaviour of returning the token if it already exists is not following API Design Guide
    // It should respond with 303 See Other and a Location header to the existing resource
    // But as the v1 of the user profile is not following this, we will keep the same behaviour.
    return this.userTokenService.addDeviceToken(body.deviceToken, user)
  }
}
