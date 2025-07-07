import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ProblemModule } from '@island.is/nest/problem'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'

import appModuleConfig from './app.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    AuditTrailModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appModuleConfig, auditTrailModuleConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
