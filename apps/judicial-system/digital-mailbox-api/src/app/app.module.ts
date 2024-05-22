import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ProblemModule } from '@island.is/nest/problem'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'

import { AuthModule } from '../lib/auth.module'
import { authModuleConfig } from './app.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    AuthModule,
    AuditTrailModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authModuleConfig, auditTrailModuleConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
