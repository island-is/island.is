import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule, AuditConfig } from '@island.is/nest/audit'
import { ConfigModule } from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../environments'
import { SequelizeConfigService } from '../sequelizeConfig.service'
import { SessionsConfig } from './sessions.config'
import { SessionsModule } from './sessions/sessions.module'

@Module({
  imports: [
    AuditModule,
    AuthModule.register(environment.auth),
    ProblemModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SessionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SessionsConfig, AuditConfig],
    }),
  ],
})
export class AppModule {}
