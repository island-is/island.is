import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@island.is/auth-nest-tools'
import { ProblemModule } from '@island.is/nest/problem'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'

import environment from './environments/environment'
import { CaseController } from './modules/cases/case.controller'
import { CaseService } from './modules/cases/case.service'
import { DefenderController } from './modules/defenders/defender.controller'
import { appModuleConfig } from './app.config'

@Module({
  imports: [
    AuditTrailModule,
    CacheModule.register({
      ttl: 60 * 5 * 1000, // 5 minutes
    }),
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appModuleConfig, auditTrailModuleConfig],
    }),
    AuthModule.register(environment.auth),
  ],
  controllers: [CaseController, DefenderController],
  providers: [CaseService],
})
export class AppModule {}
