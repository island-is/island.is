import { Module } from '@nestjs/common'

import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'
import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { environment } from '../../../environments'
import { CourtService } from './court.service'

@Module({
  imports: [
    CourtClientModule.register({
      xRoadPath: createXRoadAPIPath(
        environment.xRoad.basePathWithEnv,
        XRoadMemberClass.GovernmentInstitution,
        environment.courtClientOptions.memberCode,
        environment.courtClientOptions.apiPath,
      ),
      xRoadClient: environment.xRoad.clientId,
      clientCert: environment.xRoad.clientCert,
      clientKey: environment.xRoad.clientKey,
      clientCa: environment.xRoad.clientCa,
      serviceOptions: environment.courtClientOptions.serviceOptions,
    }),
  ],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
