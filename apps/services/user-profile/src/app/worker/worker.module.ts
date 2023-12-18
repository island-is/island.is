import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuditModule } from '@island.is/nest/audit'
import { LoggingModule } from '@island.is/logging'

import { SequelizeConfigService } from '../sequelizeConfig.service'

import { environment } from '../../environments'
import { UserProfileWorkerService } from './worker.service'
import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileAdvania } from './userProfileAdvania.model'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([UserProfile, UserProfileAdvania]),
  ],
  providers: [UserProfileWorkerService],
})
export class UserProfileWorkerModule {}
