import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'
import { SigningModule } from '@island.is/dokobit-signing'
import { EmailModule } from '@island.is/email-service'
import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { environment } from '../../../environments'
import { UserModule } from '../user'
import { Case } from './models'
import { CaseController } from './case.controller'
import { CaseService } from './case.service'
import { CourtService } from './court.service'

@Module({
  imports: [
    SigningModule.register(environment.signingOptions),
    EmailModule.register(environment.emailOptions),
    CourtClientModule.register({
      xRoadPath: createXRoadAPIPath(
        environment.xRoad.basePathWithEnv,
        XRoadMemberClass.GovernmentInstitution,
        environment.courtService.memberCode,
        environment.courtService.apiPath,
      ),
      xRoadClient: environment.xRoad.clientId,
      clientCert: environment.xRoad.clientCert,
      clientKey: environment.xRoad.clientKey,
      clientCa: environment.xRoad.clientCa,
      username: environment.courtService.username,
      password: environment.courtService.password,
    }),
    UserModule,
    SequelizeModule.forFeature([Case]),
  ],
  providers: [CaseService, CourtService],
  controllers: [CaseController],
  exports: [CaseService],
})
export class CaseModule {}
