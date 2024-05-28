import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@island.is/auth-nest-tools'
import { ProblemModule } from '@island.is/nest/problem'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'
import {
  LawyersModule,
  lawyersModuleConfig,
} from '@island.is/judicial-system/lawyers'

import environment from './environments/environment'
import { digitalMailboxModuleConfig } from './app.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DefenderController } from './defender.controller'

@Module({
  imports: [
    AuditTrailModule,
    LawyersModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        digitalMailboxModuleConfig,
        auditTrailModuleConfig,
        lawyersModuleConfig,
      ],
    }),
    AuthModule.register(environment.auth),
  ],
  controllers: [AppController, DefenderController],
  providers: [AppService],
})
export class AppModule {}
