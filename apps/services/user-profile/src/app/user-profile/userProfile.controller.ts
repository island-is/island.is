import { UserProfileScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  Scopes,
  ScopesGuard,
  IdsUserGuard,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  Body,
  Controller,
  Get,
  NotFoundException,
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
import { IslykillService } from './islykill.service'
import { DataStatus } from './types/dataStatusTypes'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('User Profile')
@Controller()
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly verificationService: VerificationService,
    private readonly auditService: AuditService,
    private readonly islyklarService: IslykillService,
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

    let userProfile = await this.userProfileService.findByNationalId(nationalId)

    const islyklarData = await this.islyklarService.getIslykillSettings(
      nationalId,
    )

    // Has No data.
    if (!userProfile && islyklarData.noUserFound) {
      throw new NotFoundException(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    }

    /**
     * User only has islyklar data.
     * If the user only has islyklar data,
     * a userprofile should be created for data combination.
     */
    if (!userProfile && !islyklarData.noUserFound) {
      userProfile = await this.create({ nationalId }, user)
    }

    userProfile.setDataValue('mobilePhoneNumber', islyklarData?.mobile)
    userProfile.setDataValue('email', islyklarData?.email)
    userProfile.setDataValue('canNudge', islyklarData?.canNudge)
    userProfile.setDataValue('bankInfo', islyklarData?.bankInfo)

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

    /**
     * Email verification
     */
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

    /**
     * Mobile phone verification
     */
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

    /**
     * Islyklar service.
     * The islyklar service is meant to be a temporary solution
     * while we have not migrated the user data from the previous db.
     */
    if (userProfileDto.email || userProfileDto.mobilePhoneNumber) {
      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      const emailVerified = userProfileDto.emailStatus === DataStatus.VERIFIED
      const mobileVerified = userProfileDto.mobileStatus === DataStatus.VERIFIED
      if (
        (userProfileDto.email && !emailVerified) ||
        (userProfileDto.mobilePhoneNumber && !mobileVerified)
      ) {
        throw new ForbiddenException(
          'Create profile: Updating value verification invalid',
        )
      }

      if (islyklarData.noUserFound) {
        await this.islyklarService
          .createIslykillSettings(user.nationalId, {
            email: emailVerified ? userProfileDto.email : undefined,
            mobile: mobileVerified
              ? userProfileDto.mobilePhoneNumber
              : undefined,
          })
          .catch((error) => {
            throw new BadRequestException(
              `createIslykillSettings failed in userprofile create: ${error.message}`,
            )
          })
      } else {
        await this.islyklarService
          .updateIslykillSettings(user.nationalId, {
            email: emailVerified ? userProfileDto.email : islyklarData.email,
            mobile: mobileVerified
              ? userProfileDto.mobilePhoneNumber
              : islyklarData.mobile,
            bankInfo: islyklarData.bankInfo,
            canNudge: islyklarData.canNudge,
          })
          .catch((error) => {
            throw new BadRequestException(
              `updateIslykillSettings failed in userprofile create: ${error.message}`,
            )
          })
      }
    }

    /**
     * Email and mobile number should not be stored within the userprofile db.
     * This should only be stored with the islyklar data.
     */
    const userProfileCreateObject = {
      ...userProfileDto,
      email: undefined,
      mobile: undefined,
    }

    const userProfile = await this.userProfileService.create(
      userProfileCreateObject,
    )
    this.auditService.audit({
      auth: user,
      action: 'create',
      resources: userProfileCreateObject.nationalId,
      meta: { fields: Object.keys(userProfileCreateObject) },
    })

    userProfile.setDataValue(
      'mobilePhoneNumber',
      userProfileDto.mobilePhoneNumberVerified
        ? userProfileDto.mobilePhoneNumber
        : undefined,
    )
    userProfile.setDataValue(
      'email',
      userProfileDto.emailVerified ? userProfileDto.email : undefined,
    )
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

    const userProfile = await this.userProfileService.findByNationalId(
      nationalId,
    )

    if (!userProfile) {
      const ret = await this.create({ nationalId }, user)
      return ret
    }
    return userProfile
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
      emailStatus: profile.emailStatus as DataStatus,
    }

    /**
     * Mobile phone verification
     */
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

    /**
     * Email verification
     */
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

    /**
     * Islyklar service.
     * The islyklar service is meant to be a temporary solution
     * while we have not migrated the user data from the previous db.
     */
    const islyklarData = await this.islyklarService.getIslykillSettings(
      user.nationalId,
    )

    const emailVerified =
      userProfileToUpdate.emailStatus === DataStatus.VERIFIED
    const mobileVerified =
      userProfileToUpdate.mobileStatus === DataStatus.VERIFIED
    if (
      (userProfileToUpdate.email && !emailVerified) ||
      (userProfileToUpdate.mobilePhoneNumber && !mobileVerified)
    ) {
      throw new ForbiddenException(
        'Update profile: Updating value verification invalid',
      )
    }

    let email =
      userProfileToUpdate.email && emailVerified
        ? userProfileToUpdate.email
        : islyklarData.email

    if (userProfileToUpdate.email === DataStatus.EMPTY) {
      email = undefined
    }

    let mobile =
      userProfileToUpdate.mobilePhoneNumber && mobileVerified
        ? userProfileToUpdate.mobilePhoneNumber
        : islyklarData.mobile

    if (userProfileToUpdate.mobilePhoneNumber === DataStatus.EMPTY) {
      mobile = undefined
    }

    if (islyklarData.noUserFound) {
      await this.islyklarService
        .createIslykillSettings(user.nationalId, {
          email,
          mobile,
        })
        .catch((error) => {
          throw new BadRequestException(
            `createIslykillSettings failed in userprofile update: ${error.message}`,
          )
        })
    } else {
      await this.islyklarService
        .updateIslykillSettings(user.nationalId, {
          email,
          mobile,
          canNudge: userProfileToUpdate.canNudge ?? islyklarData.canNudge,
          bankInfo: userProfileToUpdate.bankInfo ?? islyklarData.bankInfo,
        })
        .catch((error) => {
          throw new BadRequestException(
            `updateIslykillSettings failed in userprofile update: ${error.message}`,
          )
        })
    }

    /**
     * Email and mobile number should NOT be stored within the userprofile db.
     * This should only be stored with the islyklar data. Removing from update object.
     */
    const userProfileUpdateObject = {
      ...userProfileToUpdate,
      email: undefined,
      mobile: undefined,
    }

    const {
      numberOfAffectedRows,
      updatedUserProfile,
    } = await this.userProfileService.update(
      nationalId,
      userProfileUpdateObject,
    )
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    }
    this.auditService.audit({
      auth: user,
      action: 'update',
      resources: updatedUserProfile.nationalId,
      meta: { fields: updatedFields },
    })

    // Return updated user with islyklar email and mobile
    updatedUserProfile.setDataValue('mobilePhoneNumber', mobile)
    updatedUserProfile.setDataValue('email', email)
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
      return await this.userProfileService.addDeviceToken(body, user)
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
