import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'
import { EmailModule } from '@island.is/email-service'

import { environment } from '../../../environments'
import {
  AwsS3Module,
  CourtModule,
  DefendantModule,
  EventModule,
  FileModule,
  UserModule,
} from '../index'

import { Case } from './models/case.model'
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
    SequelizeModule.forFeature([Case]),
  ],
  providers: [CaseService],
  controllers: [CaseController],
  exports: [CaseService],
})
export class CaseModule {}
