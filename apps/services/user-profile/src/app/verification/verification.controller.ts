import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserProfileByNationalIdPipe } from '../user-profile/pipes/userProfileByNationalId.pipe';
import { UserProfile } from '../user-profile/userProfile.model';
import { ConfirmEmailDto } from './dto/confirmEmailDto';
import { ConfirmSmsDto } from './dto/confirmSmsDto';
import { CreateSmsVerificationDto } from './dto/createSmsVerificationDto';
import { EmailVerification } from './email-verification.model';
import { SmsVerification } from './sms-verification.model';
import { VerificationService } from './verification.service';

@ApiTags('Verification')
@Controller()
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
  ) { }

  @Post('emailVerification/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user for email verification.',
    allowEmptyValue: false,
  })
  @ApiCreatedResponse({ type: EmailVerification })
  async createVerification(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
  ): Promise<EmailVerification | null> {
    return await this.verificationService.createEmailVerification(profile.nationalId, profile.email)
  }

  @Post('confirmEmail/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user for email verification.',
    allowEmptyValue: false,
  })
  @ApiCreatedResponse({ type: EmailVerification })
  async confirmEmail(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
    @Body() confirmEmailDto: ConfirmEmailDto
  ): Promise<void> {
    await this.verificationService.confirmEmail(confirmEmailDto, profile)
  }

  @Post('confirmSms/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user for email verification.',
    allowEmptyValue: false,
  })
  @ApiCreatedResponse({ type: EmailVerification })
  async confirmSms(
    @Param('nationalId')
    nationalId: string,
    @Body() confirmSmsDto: ConfirmSmsDto
  ): Promise<void> {
    await this.verificationService.confirmSms(confirmSmsDto, nationalId)
  }

  @Post('smsVerification/')
  @ApiCreatedResponse({ type: SmsVerification })
  async createSmsVerification(
    @Body() createSmsVerification: CreateSmsVerificationDto
  ): Promise<SmsVerification | null> {
    return await this.verificationService.createSmsVerification(createSmsVerification)
  }
}
