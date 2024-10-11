import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { LoggingModule } from '@island.is/logging'

import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { Session } from '../sessions/session.model'
import { SessionsCleanupService } from './cleanup-worker.service'

@Module({
  imports: [
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Session]),
  ],
  providers: [SessionsCleanupService],
})
export class SessionsCleanupWorkerModule {}
