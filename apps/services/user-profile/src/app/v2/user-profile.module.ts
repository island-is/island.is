import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserProfile } from '../user-profile/userProfile.model'
import { AuditModule } from '@island.is/nest/audit'
import environment from '../../environments/environment'
import { AuthModule } from '@island.is/auth-nest-tools'
import { MeUserProfileController } from './me-user-profile.controller'
import { UserProfileService } from './user-profile.service'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forFeature([UserProfile]),
  ],
  controllers: [MeUserProfileController],
  providers: [UserProfileService],
})
export class V2UserProfileModule {}
