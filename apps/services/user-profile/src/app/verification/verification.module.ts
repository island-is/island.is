import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfileByNationalIdPipe } from '../user-profile/pipes/userProfileByNationalId.pipe';
import { UserProfile } from '../user-profile/userProfile.model';
import { UserProfileModule } from '../user-profile/userProfile.module';
import { UserProfileService } from '../user-profile/userProfile.service';
import { EmailVerification } from './email-verification.model';
import { VerificationController } from './verifiction.controller';
import { VerificationService } from './verification.service';

@Module({
  imports: [UserProfileModule, SequelizeModule.forFeature([EmailVerification, EmailVerification, UserProfile])],
  controllers: [VerificationController],
  providers: [VerificationService, UserProfileService, UserProfileByNationalIdPipe],
})
export class VerificationModule { };
