import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'

import { MessageModule } from '@island.is/judicial-system/message'

import { CaseArchive, CaseString, DateLog } from '../repository'
import {
  AwsS3Module,
  CourtModule,
  DefendantModule,
  EventLogModule,
  EventModule,
  FileModule,
  IndictmentCountModule,
  PoliceModule,
  RepositoryModule,
  SubpoenaModule,
  UserModule,
  VerdictModule,
  VictimModule,
} from '..'
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
    forwardRef(() => RepositoryModule),
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
    SequelizeModule.forFeature([CaseArchive, DateLog, CaseString]),
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
