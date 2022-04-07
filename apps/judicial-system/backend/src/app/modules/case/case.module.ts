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
import { CaseService } from './case.service'

@Module({
  imports: [
    SigningModule.register(environment.signingOptions),
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
  providers: [CaseService],
  controllers: [CaseController],
  exports: [CaseService],
})
export class CaseModule {}
