import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfileController } from './userProfile.controller';
import { UserProfile } from './userProfile.model';
import { UserProfileService } from './userProfile.service';

@Module({
  imports: [SequelizeModule.forFeature([UserProfile])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule { }
