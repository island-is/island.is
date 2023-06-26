import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SigningModule } from '@island.is/dokobit-signing'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { MessageModule } from '@island.is/judicial-system/message'

import {
  DefendantModule,
  UserModule,
  FileModule,
  IndictmentCountModule,
  CourtModule,
  AwsS3Module,
  EventModule,
  PoliceModule,
} from '../index'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { CaseController } from './case.controller'
import { InternalCaseController } from './internalCase.controller'
import { LimitedAccessCaseController } from './limitedAccessCase.controller'
import { CaseService } from './case.service'
import { InternalCaseService } from './internalCase.service'
import { LimitedAccessCaseService } from './limitedAccessCase.service'

@Module({
  imports: [
    SigningModule,
    CmsTranslationsModule,
    MessageModule,
    forwardRef(() => DefendantModule),
    forwardRef(() => UserModule),
    forwardRef(() => FileModule),
    forwardRef(() => IndictmentCountModule),
    forwardRef(() => CourtModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => EventModule),
    forwardRef(() => PoliceModule),
    SequelizeModule.forFeature([Case, CaseArchive]),
  ],
  providers: [CaseService, InternalCaseService, LimitedAccessCaseService],
  controllers: [
    CaseController,
    InternalCaseController,
    LimitedAccessCaseController,
  ],
  exports: [CaseService, LimitedAccessCaseService],
})
export class CaseModule {}
