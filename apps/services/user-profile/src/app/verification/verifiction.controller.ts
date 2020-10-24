import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserProfileByNationalIdPipe } from '../user-profile/pipes/userProfileByNationalId.pipe';
import { UserProfile } from '../user-profile/userProfile.model';
import { UserProfileModule } from '../user-profile/userProfile.module';
import { UserProfileService } from '../user-profile/userProfile.service';
import { CreateEmailVerificationDto } from './dto/createEmailVerificationDto';
import { EmailVerification } from './email-verification.model';
import { VerificationService } from './verification.service';

@ApiTags('Verification')
@Controller()
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly userProfileSerivce: UserProfileService
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
  async create(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
  ): Promise<EmailVerification | null> {
    return await this.verificationService.createEmailVerification(profile.nationalId, profile.email)
  }
}
