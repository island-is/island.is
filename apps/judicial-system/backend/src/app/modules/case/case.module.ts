import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SigningService, SIGNING_OPTIONS } from '@island.is/dokobit-signing'
import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'
import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'
import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { environment } from '../../../environments'
import { UserModule } from '../user'
import { Case } from './models'
import { CaseController } from './case.controller'
import { CaseService } from './case.service'

@Module({
  imports: [
    CourtClientModule.register({
      xRoadPath: createXRoadAPIPath(
        'http://securityserver.dev01.devland.is/r1/IS-DEV',
        XRoadMemberClass.GovernmentInstitution,
        '10019',
        '/Domstolasyslan-Protected/JusticePortal-v1',
      ),
      xRoadClient: 'IS-DEV/GOV/10014/Rettarvorslugatt-Client',
    }),
    UserModule,
    SequelizeModule.forFeature([Case]),
  ],
  providers: [
    CaseService,
    {
      provide: SIGNING_OPTIONS,
      useValue: environment.signingOptions,
    },
    SigningService,
    {
      provide: EMAIL_OPTIONS,
      useValue: environment.emailOptions,
    },
    EmailService,
  ],
  controllers: [CaseController],
  exports: [CaseService],
})
export class CaseModule {}
