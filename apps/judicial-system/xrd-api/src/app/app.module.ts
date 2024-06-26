import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ProblemModule } from '@island.is/nest/problem'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'
import {
  LawyersModule,
  lawyersModuleConfig,
} from '@island.is/judicial-system/lawyers'

import appModuleConfig from './app.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    AuditTrailModule,
    LawyersModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appModuleConfig, auditTrailModuleConfig, lawyersModuleConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
