import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'
import { MessageModule } from '@island.is/judicial-system/message'

import {
  CaseModule,
  CourtModule,
  CourtSessionModule,
  DefendantModule,
  EventModule,
  FileModule,
  PoliceModule,
  RepositoryModule,
} from '..'
import { InternalSubpoenaController } from './internalSubpoena.controller'
import { LimitedAccessSubpoenaController } from './limitedAccessSubpoena.controller'
import { SubpoenaController } from './subpoena.controller'
import { SubpoenaService } from './subpoena.service'

@Module({
  imports: [
    AuditTrailModule,
    CourtModule,
    forwardRef(() => CaseModule),
    forwardRef(() => PoliceModule),
    forwardRef(() => MessageModule),
    forwardRef(() => EventModule),
    forwardRef(() => DefendantModule),
    forwardRef(() => CourtSessionModule),
    forwardRef(() => FileModule),
    forwardRef(() => RepositoryModule),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auditTrailModuleConfig],
    }),
  ],
  controllers: [
    SubpoenaController,
    InternalSubpoenaController,
    LimitedAccessSubpoenaController,
  ],
  providers: [SubpoenaService],
  exports: [SubpoenaService],
})
export class SubpoenaModule {}
