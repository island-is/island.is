import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuditModule, AuditConfig } from '@island.is/nest/audit'
import { LoggingModule } from '@island.is/logging'

import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { SessionsConfig } from '../sessions.config'
import { SessionsModule } from '../sessions/sessions.module'
import { SessionsProcessor } from './sessions-processor'
import { environment } from '../../environments'

@Module({
  imports: [
    AuditModule,
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SessionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SessionsConfig, AuditConfig],
    }),
  ],
  providers: [SessionsProcessor],
})
export class WorkerModule {}
