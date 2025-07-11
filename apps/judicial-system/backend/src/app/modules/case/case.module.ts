import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'

import { MessageModule } from '@island.is/judicial-system/message'

import {
  AwsS3Module,
  CourtModule,
  DefendantModule,
  EventLogModule,
  EventModule,
  FileModule,
  IndictmentCountModule,
  PoliceModule,
  SubpoenaModule,
  UserModule,
  VictimModule,
} from '../index'
import { VerdictModule } from '../verdict/verdict.module'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { CaseString } from './models/caseString.model'
import { DateLog } from './models/dateLog.model'
import { CaseController } from './case.controller'
import { CaseService } from './case.service'
import { InternalCaseController } from './internalCase.controller'
import { InternalCaseService } from './internalCase.service'
import { LimitedAccessCaseController } from './limitedAccessCase.controller'
import { LimitedAccessCaseService } from './limitedAccessCase.service'
import { PdfService } from './pdf.service'

@Module({
  imports: [
    SigningModule,
    CmsTranslationsModule,
    MessageModule,
    forwardRef(() => DefendantModule),
    forwardRef(() => SubpoenaModule),
    forwardRef(() => VerdictModule),
    forwardRef(() => UserModule),
    forwardRef(() => FileModule),
    forwardRef(() => IndictmentCountModule),
    forwardRef(() => CourtModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => EventModule),
    forwardRef(() => PoliceModule),
    forwardRef(() => EventLogModule),
    forwardRef(() => VictimModule),
    SequelizeModule.forFeature([Case, CaseArchive, DateLog, CaseString]),
  ],
  providers: [
    CaseService,
    InternalCaseService,
    LimitedAccessCaseService,
    PdfService,
  ],
  controllers: [
    CaseController,
    InternalCaseController,
    LimitedAccessCaseController,
  ],
  exports: [
    CaseService,
    LimitedAccessCaseService,
    InternalCaseService,
    PdfService,
  ],
})
export class CaseModule {}
