import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SigningModule } from '@island.is/dokobit-signing'
import { EmailModule } from '@island.is/email-service'
import { CmsTranslationsModule } from '@island.is/cms-translations'

import { environment } from '../../../environments'
import { UserModule } from '../user'
import { FileModule } from '../file'
import { AwsS3Module } from '../aws-s3'
import { CourtModule } from '../court'
import { EventModule } from '../event'
import { Case } from './models'
import { CaseController } from './case.controller'
import { CaseService } from './case.service'

@Module({
  imports: [
    SigningModule.register(environment.signingOptions),
    EmailModule.register(environment.emailOptions),
    UserModule,
    forwardRef(() => FileModule),
    AwsS3Module,
    CourtModule,
    SequelizeModule.forFeature([Case]),
    CmsTranslationsModule,
    EventModule,
  ],
  providers: [CaseService],
  controllers: [CaseController],
  exports: [CaseService],
})
export class CaseModule {}
