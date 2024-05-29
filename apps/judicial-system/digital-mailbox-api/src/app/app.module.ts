import { CacheModule } from '@nestjs/cache-manager'
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
import { digitalMailboxCaseModuleConfig } from './modules/cases/case.config'
import { AppController } from './modules/cases/case.controller'
import { AppService } from './modules/cases/case.service'
import { DefenderController } from './modules/defenders/defender.controller'

@Module({
  imports: [
    AuditTrailModule,
    LawyersModule,
    CacheModule.register({
      ttl: 60 * 5 * 1000, // 5 minutes
    }),
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        digitalMailboxCaseModuleConfig,
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
