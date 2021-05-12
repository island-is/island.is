import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UserProfileScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  Body,
  Controller,
  Get,
  Put,
  NotFoundException,
  Param,
  Post,
  ConflictException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { ConfirmationDtoResponse } from './dto/confirmationResponseDto'
import { ConfirmEmailDto } from './dto/confirmEmailDto'
import { ConfirmSmsDto } from './dto/confirmSmsDto'
import { CreateSmsVerificationDto } from './dto/createSmsVerificationDto'
import { CreateUserProfileDto } from './dto/createUserProfileDto'
import { UpdateUserProfileDto } from './dto/updateUserProfileDto'
import { EmailVerification } from './emailVerification.model'
import { UserProfileByNationalIdPipe } from './pipes/userProfileByNationalId.pipe'
import { SmsVerification } from './smsVerification.model'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { VerificationService } from './verification.service'

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
  @Audit<UserProfile>({
    resources: (profile) => profile.nationalId,
  })
  async findOneByNationalId(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
    @CurrentUser()
    user: User,
  ): Promise<UserProfile> {
    return profile
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
    if (
      await this.userProfileService.findByNationalId(userProfileDto.nationalId)
    ) {
      throw new ConflictException(
        `A profile with nationalId - "${userProfileDto.nationalId}" already exists`,
      )
    }

    if (userProfileDto.email) {
      await this.verificationService.createEmailVerification(
        userProfileDto.nationalId,
        userProfileDto.email,
      )
    }

    if (userProfileDto.mobilePhoneNumber) {
      const phoneVerified = await this.verificationService.isPhoneNumberVerified(
        userProfileDto,
      )
      userProfileDto = {
        ...userProfileDto,
        mobilePhoneNumberVerified: phoneVerified,
      }
      if (phoneVerified) {
        await this.verificationService.removeSmsVerification(
          userProfileDto.nationalId,
        )
      }
    }

    const userProfile = await this.userProfileService.create(userProfileDto)
    this.auditService.audit({
      user,
      action: 'create',
      resources: userProfileDto.nationalId,
    })
    return userProfile
  }

  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Put('userProfile/:nationalId')
  @ApiOkResponse({ type: UserProfile })
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user profile to be updated.',
    allowEmptyValue: false,
  })
  async update(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
    @Body()
    userProfileToUpdate: UpdateUserProfileDto,
    @CurrentUser()
    user: User,
  ): Promise<UserProfile> {
    const { nationalId } = profile
    const updatedFields = Object.keys(userProfileToUpdate)
    userProfileToUpdate = {
      ...userProfileToUpdate,
      emailVerified: profile.emailVerified,
      mobilePhoneNumberVerified: profile.mobilePhoneNumberVerified,
    }

    if (userProfileToUpdate.mobilePhoneNumber) {
      const { mobilePhoneNumber } = userProfileToUpdate
      const phoneVerified = await this.verificationService.isPhoneNumberVerified(
        { nationalId, mobilePhoneNumber },
      )

      userProfileToUpdate = {
        ...userProfileToUpdate,
        mobilePhoneNumberVerified: phoneVerified,
      }
    }

    if (
      userProfileToUpdate.email &&
      userProfileToUpdate.email !== profile.email
    ) {
      await this.verificationService.createEmailVerification(
        nationalId,
        userProfileToUpdate.email,
      )
      userProfileToUpdate = { ...userProfileToUpdate, emailVerified: false }
    }

    const {
      numberOfAffectedRows,
      updatedUserProfile,
    } = await this.userProfileService.update(nationalId, userProfileToUpdate)
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    }
    this.auditService.audit({
      user,
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
  @ApiCreatedResponse({ type: EmailVerification })
  @Audit<EmailVerification>({
    resources: (emailVerification) => emailVerification.nationalId,
  })
  async recreateVerification(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
    @CurrentUser()
    user: User,
  ): Promise<EmailVerification | null> {
    if (!profile.email) {
      return null
    }

    return await this.verificationService.createEmailVerification(
      profile.nationalId,
      profile.email,
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
  @ApiCreatedResponse({ type: ConfirmationDtoResponse })
  async confirmEmail(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
    @Body()
    confirmEmailDto: ConfirmEmailDto,
    @CurrentUser()
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    return await this.auditService.auditPromise(
      {
        user,
        action: 'confirmEmail',
        resources: profile.nationalId,
      },
      this.verificationService.confirmEmail(confirmEmailDto, profile),
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
  @ApiCreatedResponse({ type: ConfirmationDtoResponse })
  async confirmSms(
    @Param('nationalId')
    nationalId: string,
    @Body()
    confirmSmsDto: ConfirmSmsDto,
    @CurrentUser()
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    return this.auditService.auditPromise(
      {
        user,
        action: 'confirmSms',
        resources: nationalId,
      },
      this.verificationService.confirmSms(confirmSmsDto, nationalId),
    )
  }

  @Scopes(UserProfileScope.write)
  @ApiSecurity('oauth2', [UserProfileScope.write])
  @Post('smsVerification/')
  @Audit<SmsVerification>({
    resources: (smsVerification) => smsVerification.nationalId,
  })
  async createSmsVerification(
    @Body() createSmsVerification: CreateSmsVerificationDto,
  ): Promise<SmsVerification | null> {
    return await this.verificationService.createSmsVerification(
      createSmsVerification,
    )
  }
}
