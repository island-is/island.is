import { Module } from '@nestjs/common'

import { MainResolver } from './resolvers/main.resolver'
import { QualityPhotoResolver } from './resolvers/qualityPhoto.resolver'
import { QualitySignatureResolver } from './resolvers/qualitySignature.resolver'
import { PenaltyPointsResolver } from './resolvers/penaltyPoints.resolver'
import { DeprivationsResolver } from './resolvers/deprivations.resolver'
import { DrivingLicenseService } from './services/drivingLicense.service'
import { PenaltyPointsService } from './services/penaltyPoints.service'
import { DeprivationsService } from './services/deprivations.service'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { NationalRegistryV3ApplicationsClientModule } from '@island.is/clients/national-registry-v3-applications'

@Module({
  imports: [
    NationalRegistryV3ApplicationsClientModule,
    DrivingLicenseApiModule,
  ],
  providers: [
    MainResolver,
    QualityPhotoResolver,
    QualitySignatureResolver,
    DrivingLicenseService,
    PenaltyPointsService,
    PenaltyPointsResolver,
    DeprivationsService,
    DeprivationsResolver,
  ],
  exports: [DrivingLicenseService],
})
export class DrivingLicenseModule {}
