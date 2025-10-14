import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'
import { MessageModule } from '@island.is/judicial-system/message'

import { Verdict } from '../repository'
import {
  CaseModule,
  DefendantModule,
  EventLogModule,
  EventModule,
  FileModule,
  LawyerRegistryModule,
  PoliceModule,
} from '..'
import { InternalVerdictController } from './internalVerdict.controller'
import { VerdictController } from './verdict.controller'
import { VerdictService } from './verdict.service'

@Module({
  imports: [
    AuditTrailModule,
    MessageModule,
    forwardRef(() => CaseModule),
    forwardRef(() => EventModule),
    forwardRef(() => PoliceModule),
    forwardRef(() => FileModule),
    forwardRef(() => DefendantModule),
    forwardRef(() => EventLogModule),
    forwardRef(() => LawyerRegistryModule),
    SequelizeModule.forFeature([Verdict]),
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
