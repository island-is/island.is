import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver, QualityPhotoResolver } from './graphql'
import { DrivingLicenseService } from './drivingLicense.service'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

@Module({
  imports: [NationalRegistryXRoadModule, DrivingLicenseApiModule],
  providers: [MainResolver, QualityPhotoResolver, DrivingLicenseService],
  exports: [DrivingLicenseService],
})
export class DrivingLicenseModule {}
