import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
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
  ForbiddenException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
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
      throw new NotFoundException(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    }

    return userProfile
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
      meta: { fields: Object.keys(userProfileDto) },
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
    @Param('nationalId')
    nationalId: string,
    @Body()
    userProfileToUpdate: UpdateUserProfileDto,
    @CurrentUser()
    user: User,
  ): Promise<UserProfile> {
    // findOneByNationalId must be first as it implictly checks if the
    // route param matches the authenticated user.
    const profile = await this.findOneByNationalId(nationalId, user)
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
    if (!profile.email) {
      throw new BadRequestException(
        'Profile does not have a configured email address.',
      )
    }

    await this.verificationService.createEmailVerification(
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
}
