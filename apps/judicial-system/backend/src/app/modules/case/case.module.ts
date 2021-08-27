import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SigningModule } from '@island.is/dokobit-signing'
import { EmailModule } from '@island.is/email-service'
import { CmsTranslationsModule } from '@island.is/cms-translations'

import { environment } from '../../../environments'
import { UserModule } from '../user'
import { CourtModule } from '../court'
import { FileModule } from '../file/file.module'
import { Case } from './models'
import { CaseController } from './case.controller'
import { CaseService } from './case.service'
@Module({
  imports: [
    SigningModule.register(environment.signingOptions),
    EmailModule.register(environment.emailOptions),
    UserModule,
    CourtModule,
    SequelizeModule.forFeature([Case]),
    CmsTranslationsModule,
    forwardRef(() => FileModule),
  ],
  providers: [CaseService],
  controllers: [CaseController],
  exports: [CaseService],
})
export class CaseModule {}
