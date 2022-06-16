import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SigningModule } from '@island.is/dokobit-signing'
import { EmailModule } from '@island.is/email-service'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { QueueModule } from '@island.is/message-queue'

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
import { InternalCaseController } from './internalCase.controller'
import { LimitedAccessCaseController } from './limitedAccessCase.controller'
import { CaseService } from './case.service'
import { LimitedAccessCaseService } from './limitedAccessCase.service'
import { caseModuleConfig } from './case.config'

const config = caseModuleConfig()

@Module({
  imports: [
    SigningModule,
    EmailModule.register(environment.emailOptions),
    CmsTranslationsModule,
    QueueModule.register({
      queue: {
        name: config.sqs.queueName,
        queueName: config.sqs.queueName,
        deadLetterQueue: { queueName: config.sqs.deadLetterQueueName },
      },
      client: {
        endpoint: config.sqs.endpoint,
        region: config.sqs.region,
      },
    }),
    forwardRef(() => DefendantModule),
    forwardRef(() => UserModule),
    forwardRef(() => FileModule),
    forwardRef(() => CourtModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => EventModule),
    SequelizeModule.forFeature([Case, CaseArchive]),
  ],
  providers: [CaseService, LimitedAccessCaseService],
  controllers: [
    CaseController,
    InternalCaseController,
    LimitedAccessCaseController,
  ],
  exports: [CaseService],
})
export class CaseModule {}
