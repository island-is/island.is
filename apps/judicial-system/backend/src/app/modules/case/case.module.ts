import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SigningModule } from '@island.is/dokobit-signing'
import { EmailModule } from '@island.is/email-service'

import { environment } from '../../../environments'
import { UserModule } from '../user'
import { CourtModule } from '../court'
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
  ],
  providers: [CaseService],
  controllers: [CaseController],
  exports: [CaseService],
})
export class CaseModule {}
