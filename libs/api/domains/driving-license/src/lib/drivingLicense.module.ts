import { Module } from '@nestjs/common'

import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { NationalRegistryV3ApplicationsClientModule } from '@island.is/clients/national-registry-v3-applications'

import { DeprivationsResolver } from './resolvers/deprivations.resolver'
import { MainResolver } from './resolvers/main.resolver'
import { PenaltyPointsResolver } from './resolvers/penaltyPoints.resolver'
import { QualityPhotoResolver } from './resolvers/qualityPhoto.resolver'
import { QualitySignatureResolver } from './resolvers/qualitySignature.resolver'
import { DeprivationsService } from './services/deprivations.service'
import { DrivingLicenseService } from './services/drivingLicense.service'
import { PenaltyPointsService } from './services/penaltyPoints.service'

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
