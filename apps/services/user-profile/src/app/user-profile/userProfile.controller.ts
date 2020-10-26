import {
  Body,
  Controller,
  Get,
  Put,
  NotFoundException,
  Param,
  Post,
  ConflictException, BadRequestException
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { VerificationService } from '../verification/verification.service'
import { CreateUserProfileDto } from './dto/createUserProfileDto'
import { UpdateUserProfileDto } from './dto/updateUserProfileDto'
import { UserProfileByNationalIdPipe } from './pipes/userProfileByNationalId.pipe'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'

@ApiTags('User Profile')
@Controller()
export class UserProfileController {

  constructor(private userProfileService: UserProfileService,
    private verificationService: VerificationService) { }

  @Get('userProfile/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The nationalId of the application to update.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: UserProfile })
  async findOneByNationalId(
    @Param('nationalId', UserProfileByNationalIdPipe) profile: UserProfile,
  ): Promise<UserProfile> {
    return profile
  }

  @Post('userProfile/')
  @ApiCreatedResponse({ type: UserProfile })
  async create(
    @Body()
    userProfileDto: CreateUserProfileDto,
  ): Promise<UserProfile> {
    if (
      await this.userProfileService.findByNationalId(userProfileDto.nationalId)
    ) {
      throw new ConflictException(
        `A profile with nationalId - "${userProfileDto.nationalId}" already exists`,
      )
    }
    if (userProfileDto.mobilePhoneNumber) {
      const phoneVerified = await this.verificationService.isPhoneNumberVerified(userProfileDto)
      if (!phoneVerified)
        throw new BadRequestException(`Phone number: ${userProfileDto.mobilePhoneNumber} is not verified`)
      else
        userProfileDto = { ...userProfileDto, mobilePhoneNumberVerified: phoneVerified }
    }
    const profile = await this.userProfileService.create(userProfileDto)
    await this.verificationService.removeSmsVerification(userProfileDto.nationalId)
    await this.verificationService.createEmailVerification(
      profile.nationalId,
      profile.email
    )

    return profile
  }

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
    @Param('nationalId', UserProfileByNationalIdPipe) profile: UserProfile,
    @Body() userProfileToUpdate: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const { nationalId } = profile

    if (userProfileToUpdate.mobilePhoneNumber) {
      const { mobilePhoneNumber } = userProfileToUpdate
      const phoneVerified = await this.verificationService
        .isPhoneNumberVerified({ nationalId, mobilePhoneNumber })
      if (!phoneVerified) throw new BadRequestException(`Phone number: ${mobilePhoneNumber} is not verified`)
      userProfileToUpdate = { ...userProfileToUpdate, mobilePhoneNumberVerified: phoneVerified }
    }

    if (userProfileToUpdate.email) {
      await this.verificationService.createEmailVerification(
        nationalId,
        userProfileToUpdate.email
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
    return updatedUserProfile
  }
}
