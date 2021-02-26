import { Module } from '@nestjs/common'

import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'
import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { environment } from '../../../environments'
import { AuditModule } from '../audit'
import { CourtResolver } from './court.resolver'
import { CourtService } from './court.service'

@Module({
  imports: [
    CourtClientModule.register({
      xRoadPath: createXRoadAPIPath(
        environment.xRoad.basePathWithEnv,
        XRoadMemberClass.GovernmentInstitution,
        environment.courtService.memberCode,
        environment.courtService.apiPath,
      ),
      xRoadClient: environment.xRoad.clientId,
    }),
    AuditModule,
  ],
  providers: [CourtResolver, CourtService],
})
export class CourtModule {}
