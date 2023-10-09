import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'

import environment from '../../environments/environment'
import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileService } from './user-profile.service'
import { MeUserProfileController } from './me-user-profile.controller'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forFeature([UserProfile]),
  ],
  controllers: [MeUserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
