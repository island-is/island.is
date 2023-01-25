import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config'

import { ActivitiesProcessor } from './activities.processor'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { LoggingModule } from '@island.is/logging'
import { Session } from '../sessions/session.model'
import { ActivitiesConfig } from '../activities.config'
import { SessionsService } from '../sessions/sessions.service'
import { SessionsModule } from '../sessions/sessions.module'

@Module({
  imports: [
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Session]),
    SessionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ActivitiesConfig],
    }),
  ],
  providers: [ActivitiesProcessor, SessionsService],
})
export class WorkerModule {}
