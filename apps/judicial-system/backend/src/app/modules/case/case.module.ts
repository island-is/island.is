import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SigningModule } from '@island.is/dokobit-signing'
import { EmailModule } from '@island.is/email-service'
import { CmsTranslationsModule } from '@island.is/cms-translations'

import { environment } from '../../../environments'
import {
  DefendantModule,
  UserModule,
  FileModule,
  CourtModule,
  AwsS3Module,
  EventModule,
} from '../index'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { CaseController } from './case.controller'
import { RestrictedCaseController } from './restrictedCase.controller'
import { CaseService } from './case.service'
import { RestrictedCaseService } from './restrictedCase.service'

@Module({
  imports: [
    SigningModule,
    EmailModule.register(environment.emailOptions),
    CmsTranslationsModule,
    forwardRef(() => DefendantModule),
    forwardRef(() => UserModule),
    forwardRef(() => FileModule),
    forwardRef(() => CourtModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => EventModule),
    SequelizeModule.forFeature([Case, CaseArchive]),
  ],
  providers: [CaseService, RestrictedCaseService],
  controllers: [CaseController, RestrictedCaseController],
  exports: [CaseService],
})
export class CaseModule {}
