import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuditModule } from '@island.is/nest/audit'
import environment from '../../environments/environment'
import { AuthModule } from '@island.is/auth-nest-tools'
import { MeUserProfileController } from './me-user-profile.controller'
import { UserProfileService } from './user-profile.service'
import { UserProfile } from './userProfileV2.model'

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
