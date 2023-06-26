import { Module } from '@nestjs/common'

import {
  MainResolver,
  QualityPhotoResolver,
  QualitySignatureResolver,
} from './graphql'
import { DrivingLicenseService } from './drivingLicense.service'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

@Module({
  imports: [NationalRegistryXRoadModule, DrivingLicenseApiModule],
  providers: [
    MainResolver,
    QualityPhotoResolver,
    QualitySignatureResolver,
    DrivingLicenseService,
  ],
  exports: [DrivingLicenseService],
})
export class DrivingLicenseModule {}
