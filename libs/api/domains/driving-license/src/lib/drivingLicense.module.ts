import { Module } from '@nestjs/common'

import {
  MainResolver,
  QualityPhotoResolver,
  QualitySignatureResolver,
} from './graphql'
import { DrivingLicenseService } from './drivingLicense.service'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { NationalRegistryV3ApplicationsClientModule } from '@island.is/clients/national-registry-v3-applications'

@Module({
  imports: [NationalRegistryV3ApplicationsClientModule, DrivingLicenseApiModule],
  providers: [
    MainResolver,
    QualityPhotoResolver,
    QualitySignatureResolver,
    DrivingLicenseService,
  ],
  exports: [DrivingLicenseService],
})
export class DrivingLicenseModule {}
