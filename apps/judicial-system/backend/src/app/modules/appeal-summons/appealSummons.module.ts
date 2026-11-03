import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'

import { AwsS3Module, CaseModule, PoliceModule, RepositoryModule } from '..'
import { AppealSummonsController } from './appealSummons.controller'
import { AppealSummonsService } from './appealSummons.service'
import { InternalAppealSummonsController } from './internalAppealSummons.controller'

@Module({
  imports: [
    AuditTrailModule,
    forwardRef(() => CaseModule),
    forwardRef(() => RepositoryModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => PoliceModule),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auditTrailModuleConfig],
    }),
  ],
  controllers: [AppealSummonsController, InternalAppealSummonsController],
  providers: [AppealSummonsService],
  exports: [AppealSummonsService],
})
export class AppealSummonsModule {}
