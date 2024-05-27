import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@island.is/auth-nest-tools'
import { ProblemModule } from '@island.is/nest/problem'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'

import environment from './environments/environment'
import { digitalMailboxModuleConfig } from './app.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    AuditTrailModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [digitalMailboxModuleConfig, auditTrailModuleConfig],
    }),
    AuthModule.register(environment.auth),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
