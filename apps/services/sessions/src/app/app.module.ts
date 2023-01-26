import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import { ConfigModule } from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../environments'
import { SequelizeConfigService } from '../sequelizeConfig.service'
import { SessionsModule } from './sessions/sessions.module'
import { SessionsConfig } from './sessions.config'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    ProblemModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SessionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SessionsConfig],
    }),
  ],
})
export class AppModule {}
