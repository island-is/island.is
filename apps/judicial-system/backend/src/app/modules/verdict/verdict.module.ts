import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'

import {
  CaseModule,
  DefendantModule,
  EventLogModule,
  EventModule,
  FileModule,
  LawyerRegistryModule,
  PoliceModule,
  RepositoryModule,
} from '..'
import { InternalVerdictController } from './internalVerdict.controller'
import { VerdictController } from './verdict.controller'
import { VerdictService } from './verdict.service'

@Module({
  imports: [
    AuditTrailModule,
    forwardRef(() => CaseModule),
    forwardRef(() => EventModule),
    forwardRef(() => PoliceModule),
    forwardRef(() => FileModule),
    forwardRef(() => DefendantModule),
    forwardRef(() => EventLogModule),
    forwardRef(() => LawyerRegistryModule),
    forwardRef(() => RepositoryModule),
    forwardRef(() => MessageModule),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auditTrailModuleConfig],
    }),
  ],
  controllers: [VerdictController, InternalVerdictController],
  providers: [VerdictService],
  exports: [VerdictService],
})
export class VerdictModule {}
