import { Module } from '@nestjs/common';
import { UserProfileController } from './userProfile.controller';
import { UserProfileService } from './userProfile.service';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule { }
