import { UserProfileScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  Scopes,
  ScopesGuard,
  IdsUserGuard,
  CurrentActor,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ConflictException,
  UseGuards,
  ForbiddenException,
  BadRequestException,
  HttpCode,
  Delete,
  Patch,
} from '@nestjs/common'
import { NoContentException } from '@island.is/nest/problem'
import {
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { ConfirmationDtoResponse } from './dto/confirmationResponseDto'
import { ConfirmEmailDto } from './dto/confirmEmailDto'
import { ConfirmSmsDto } from './dto/confirmSmsDto'
import { CreateSmsVerificationDto } from './dto/createSmsVerificationDto'
import { CreateEmailVerificationDto } from './dto/createEmailVerificationDto'
import { CreateUserProfileDto } from './dto/createUserProfileDto'
import { DeleteTokenResponseDto } from './dto/deleteTokenResponseDto'
import { DeviceTokenDto } from './dto/deviceToken.dto'
import { UpdateUserProfileDto } from './dto/updateUserProfileDto'
import { UserDeviceTokenDto } from './dto/userDeviceToken.dto'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { VerificationService } from './verification.service'
import { DataStatus } from './types/dataStatusTypes'
import { ActorLocale } from './dto/actorLocale'
import { Locale } from './types/localeTypes'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('User Profile')
@Controller()
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly verificationService: VerificationService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(UserProfileScope.read)
  @ApiSecurity('oauth2', [UserProfileScope.read])
  @Get('userProfile/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The nationalId of the application to update.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: UserProfile })
  @ApiNoContentResponse()
  @Audit<UserProfile>({
    resources: (profile) => profile.nationalId,
  })
  async findOneByNationalId(
    @Param('nationalId')
    nationalId: string,
    @CurrentUser()
    user: User,
  ): Promise<UserProfile> {
    if (nationalId != user.nationalId) {
      throw new ForbiddenException()
    }

    const userProfile = await this.userProfileService.findByNationalId(
      nationalId,
    )
    if (!userProfile) {
      throw new NoContentException()
    }

    return userProfile
  }

  @Scopes(UserProfileScope.read)
  @ApiSecurity('oauth2', [UserProfileScope.read])
  @Get('actor/locale')
  @ApiOkResponse({ type: ActorLocale })
  @ApiNoContentResponse()
  @Audit<ActorLocale>({
    resources: (profile) => profile.nationalId,
  })
  async getActorLocale(@CurrentActor() actor: User): Promise<ActorLocale> {
    const userProfile = await this.userProfileService.findByNationalId(
      actor.nationalId,
    )
    if (!userProfile) {
      throw new NoContentException()
    }

    return {
      nationalId: userProfile.nationalId,
      locale: userProfile.locale ?? Locale.ICELANDIC,
    }
  }

  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Post('userProfile/')
  @ApiCreatedResponse({ type: UserProfile })
  async create(
    @Body()
    userProfileDto: CreateUserProfileDto,
    @CurrentUser()
    user: User,
  ): Promise<UserProfile> {
    if (userProfileDto.nationalId != user.nationalId) {
      throw new ForbiddenException()
    }

    if (
      await this.userProfileService.findByNationalId(userProfileDto.nationalId)
    ) {
      throw new ConflictException(
        `A profile with nationalId - "${userProfileDto.nationalId}" already exists`,
      )
    }

    if (userProfileDto.email) {
      const emailVerified = await this.verificationService.confirmEmail(
        { hash: userProfileDto.emailCode, email: userProfileDto.email },
        user.nationalId,
      )

      if (emailVerified.confirmed) {
        userProfileDto = {
          ...userProfileDto,
          emailStatus: DataStatus.VERIFIED,
          emailVerified: emailVerified.confirmed,
        }
      } else {
        throw new BadRequestException(
          `Email not confirmed in create. Message: ${emailVerified.message}`,
        )
      }
    }

    if (userProfileDto.mobilePhoneNumber) {
      const phoneVerified = await this.verificationService.confirmSms(
        {
          code: userProfileDto.smsCode,
          mobilePhoneNumber: userProfileDto.mobilePhoneNumber,
        },
        user.nationalId,
      )

      if (phoneVerified.confirmed) {
        userProfileDto = {
          ...userProfileDto,
          emailStatus: DataStatus.VERIFIED,
          mobilePhoneNumberVerified: phoneVerified.confirmed,
        }
      } else {
        throw new BadRequestException(
          `Phone not confirmed in create. Message: ${phoneVerified.message}`,
        )
      }
    }

    const userProfile = await this.userProfileService.create(userProfileDto)
    this.auditService.audit({
      auth: user,
      action: 'create',
      resources: userProfileDto.nationalId,
      meta: { fields: Object.keys(userProfileDto) },
    })
    return userProfile
  }

  @ApiExcludeEndpoint()
  async findOrCreateUserProfile(
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<UserProfile> {
    if (nationalId != user.nationalId) {
      throw new ForbiddenException()
    }
    try {
      return await this.findOneByNationalId(nationalId, user)
    } catch (error) {
      return this.create({ nationalId }, user)
    }
  }

  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Patch('userProfile/:nationalId')
  @ApiOkResponse({ type: UserProfile })
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user profile to be updated.',
    allowEmptyValue: false,
  })
  async update(
    @Param('nationalId')
    nationalId: string,
    @Body()
    userProfileToUpdate: UpdateUserProfileDto,
    @CurrentUser()
    user: User,
  ): Promise<UserProfile> {
    if (nationalId != user.nationalId) {
      throw new ForbiddenException()
    }

    // findOrCreateUserProfile for edge cases - fragmented onboarding
    const profile = await this.findOrCreateUserProfile(nationalId, user)

    const updatedFields = Object.keys(userProfileToUpdate)
    userProfileToUpdate = {
      ...userProfileToUpdate,
      mobileStatus: profile.mobileStatus as DataStatus,
      emailStatus: profile.emails?.[0].emailStatus as DataStatus,
    }

    if (userProfileToUpdate.mobilePhoneNumber) {
      const phoneVerified = await this.verificationService.confirmSms(
        {
          code: userProfileToUpdate.smsCode,
          mobilePhoneNumber: userProfileToUpdate.mobilePhoneNumber,
        },
        user.nationalId,
      )

      if (phoneVerified.confirmed) {
        userProfileToUpdate = {
          ...userProfileToUpdate,
          mobileStatus: DataStatus.VERIFIED,
          mobilePhoneNumberVerified: phoneVerified.confirmed,
        }
      } else {
        throw new BadRequestException(
          `Phone not confirmed in update. Message: ${phoneVerified.message}`,
        )
      }
    }

    if (userProfileToUpdate.email) {
      const emailVerified = await this.verificationService.confirmEmail(
        {
          hash: userProfileToUpdate.emailCode,
          email: userProfileToUpdate.email,
        },
        user.nationalId,
      )

      if (emailVerified.confirmed) {
        userProfileToUpdate = {
          ...userProfileToUpdate,
          emailStatus: DataStatus.VERIFIED,
          emailVerified: emailVerified.confirmed,
        }
      } else {
        throw new BadRequestException(
          `Email not confirmed in update. Message: ${emailVerified.message}`,
        )
      }
    }

    const { numberOfAffectedRows, updatedUserProfile } =
      await this.userProfileService.update(nationalId, userProfileToUpdate)
    if (numberOfAffectedRows === 0) {
      throw new NoContentException()
    }
    this.auditService.audit({
      auth: user,
      action: 'update',
      resources: updatedUserProfile.nationalId,
      meta: { fields: updatedFields },
    })
    return updatedUserProfile
  }

  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Post('emailVerification/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user for email verification.',
    allowEmptyValue: false,
  })
  @HttpCode(204)
  @ApiNoContentResponse()
  @Audit()
  async recreateVerification(
    @Param('nationalId')
    nationalId: string,
    @CurrentUser()
    user: User,
  ): Promise<void> {
    // findOneByNationalId must be first as it implictly checks if the
    // route param matches the authenticated user.
    const profile = await this.findOneByNationalId(nationalId, user)
    if (!profile.emails?.[0].email) {
      throw new BadRequestException(
        'Profile does not have a configured email address.',
      )
    }

    await this.verificationService.createEmailVerification(
      profile.nationalId,
      profile.emails?.[0].email,
    )
  }

  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Post('emailVerification/')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Audit()
  async createEmailVerification(
    @Body()
    emailVerification: CreateEmailVerificationDto,
    @CurrentUser()
    user: User,
  ): Promise<void> {
    if (emailVerification.nationalId != user.nationalId) {
      throw new ForbiddenException()
    }

    await this.verificationService.createEmailVerification(
      emailVerification.nationalId,
      emailVerification.email,
    )
  }

  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Post('confirmEmail/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user for email verification.',
    allowEmptyValue: false,
  })
  @HttpCode(200)
  @ApiOkResponse({ type: ConfirmationDtoResponse })
  async confirmEmail(
    @Param('nationalId')
    nationalId: string,
    @Body()
    confirmEmailDto: ConfirmEmailDto,
    @CurrentUser()
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    // findOneByNationalId must be first as it implictly checks if the
    // route param matches the authenticated user.
    const profile = await this.findOneByNationalId(nationalId, user)

    return await this.auditService.auditPromise(
      {
        auth: user,
        action: 'confirmEmail',
        resources: profile.nationalId,
      },
      this.verificationService.confirmEmail(confirmEmailDto, nationalId),
    )
  }

  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Post('confirmSms/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user for email verification.',
    allowEmptyValue: false,
  })
  @HttpCode(200)
  @ApiOkResponse({ type: ConfirmationDtoResponse })
  async confirmSms(
    @Param('nationalId')
    nationalId: string,
    @Body()
    confirmSmsDto: ConfirmSmsDto,
    @CurrentUser()
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    if (nationalId != user.nationalId) {
      throw new ForbiddenException()
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'confirmSms',
        resources: nationalId,
      },
      this.verificationService.confirmSms(confirmSmsDto, nationalId),
    )
  }

  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Post('smsVerification/')
  @HttpCode(204)
  @ApiNoContentResponse()
  @Audit()
  async createSmsVerification(
    @Body()
    createSmsVerification: CreateSmsVerificationDto,
    @CurrentUser()
    user: User,
  ): Promise<void> {
    if (createSmsVerification.nationalId != user.nationalId) {
      throw new ForbiddenException()
    }

    await this.verificationService.createSmsVerification(createSmsVerification)
  }

  @Audit()
  @ApiOperation({
    summary: 'Adds a device token for notifications for a user device ',
  })
  @ApiOkResponse({ type: UserDeviceTokenDto })
  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Post('userProfile/:nationalId/device-tokens')
  async addDeviceToken(
    @Param('nationalId')
    nationalId: string,
    @CurrentUser() user: User,
    @Body() body: DeviceTokenDto,
  ): Promise<UserDeviceTokenDto> {
    if (nationalId != user.nationalId) {
      throw new BadRequestException()
    } else {
      // findOrCreateUserProfile for edge cases - fragmented onboarding
      await this.findOrCreateUserProfile(nationalId, user)
      // The behaviour of returning the token if it already exists is not following API Design Guide
      // It should respond with 303 See Other and a Location header to the existing resource
      // But as the v1 of the user profile is not following this, we will keep the same behaviour.
      return this.userProfileService.addDeviceToken(body, user)
    }
  }

  @Audit()
  @ApiOperation({
    summary: 'Deletes a device token for a user device',
  })
  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @ApiOkResponse({ type: DeleteTokenResponseDto })
  @Delete('userProfile/:nationalId/device-tokens')
  async deleteDeviceToken(
    @Param('nationalId')
    nationalId: string,
    @CurrentUser() user: User,
    @Body() body: DeviceTokenDto,
  ): Promise<DeleteTokenResponseDto> {
    if (nationalId != user.nationalId) {
      throw new BadRequestException()
    } else {
      return await this.userProfileService.deleteDeviceToken(body, user)
    }
  }
}
