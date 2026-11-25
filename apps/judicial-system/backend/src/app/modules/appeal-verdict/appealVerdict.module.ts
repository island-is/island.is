import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'

import {
  CaseModule,
  FileModule,
  PoliceModule,
  RepositoryModule,
} from '..'
import { AppealVerdictController } from './appealVerdict.controller'
import { AppealVerdictService } from './appealVerdict.service'
import { InternalAppealVerdictController } from './internalAppealVerdict.controller'

@Module({
  imports: [
    AuditTrailModule,
    forwardRef(() => CaseModule),
    forwardRef(() => PoliceModule),
    forwardRef(() => FileModule),
    forwardRef(() => RepositoryModule),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auditTrailModuleConfig],
    }),
  ],
  controllers: [AppealVerdictController, InternalAppealVerdictController],
  providers: [AppealVerdictService],
  exports: [AppealVerdictService],
})
export class AppealVerdictModule {}
