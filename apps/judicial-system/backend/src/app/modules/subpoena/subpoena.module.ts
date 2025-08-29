import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AuditTrailModule,
  auditTrailModuleConfig,
} from '@island.is/judicial-system/audit-trail'
import { MessageModule } from '@island.is/judicial-system/message'

import { CaseModule } from '../case/case.module'
import { CourtModule } from '../court/court.module'
import { DefendantModule } from '../defendant/defendant.module'
import { EventModule } from '../event/event.module'
import { FileModule } from '../file/file.module'
import { PoliceModule } from '../police/police.module'
import { Defendant, Subpoena } from '../repository'
import { InternalSubpoenaController } from './internalSubpoena.controller'
import { LimitedAccessSubpoenaController } from './limitedAccessSubpoena.controller'
import { SubpoenaController } from './subpoena.controller'
import { SubpoenaService } from './subpoena.service'

@Module({
  imports: [
    AuditTrailModule,
    forwardRef(() => CaseModule),
    forwardRef(() => PoliceModule),
    forwardRef(() => MessageModule),
    forwardRef(() => EventModule),
    forwardRef(() => DefendantModule),
    forwardRef(() => FileModule),
    CourtModule,
    SequelizeModule.forFeature([Subpoena, Defendant]),
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
