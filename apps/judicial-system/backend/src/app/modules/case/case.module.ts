import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SigningModule } from '@island.is/dokobit-signing'
import { EmailModule } from '@island.is/email-service'
import { CmsTranslationsModule } from '@island.is/cms-translations'

import { environment } from '../../../environments'
import { DefendantModule } from '../defendant/defendant.module'
import { UserModule, FileModule, CourtModule } from '../index'
import { AwsS3Module } from '../aws-s3'
import { EventModule } from '../event'
import { Case } from './models'
import { CaseController } from './case.controller'
import { CaseService } from './case.service'

@Module({
  imports: [
    SigningModule.register(environment.signingOptions),
    EmailModule.register(environment.emailOptions),
    forwardRef(() => DefendantModule),
    forwardRef(() => UserModule),
    forwardRef(() => FileModule),
    forwardRef(() => CourtModule),
    AwsS3Module,
    EventModule,
    CmsTranslationsModule,
    SequelizeModule.forFeature([Case]),
  ],
  providers: [CaseService],
  controllers: [CaseController],
  exports: [CaseService],
})
export class CaseModule {}
