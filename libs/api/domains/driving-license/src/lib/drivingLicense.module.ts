import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver, QualityPhotoResolver } from './graphql'
import { DrivingLicenseService } from './drivingLicense.service'
import {
  DrivingLicenseApiModule,
  DrivingLicenseApiConfig,
} from '@island.is/clients/driving-license'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

export interface Config {
  clientConfig: DrivingLicenseApiConfig
}

@Module({})
export class DrivingLicenseModule {
  static register(config: Config): DynamicModule {
    return {
      module: DrivingLicenseModule,
      imports: [
        NationalRegistryXRoadModule,
        DrivingLicenseApiModule.register(config.clientConfig),
      ],
      providers: [MainResolver, QualityPhotoResolver, DrivingLicenseService],
      exports: [DrivingLicenseService],
    }
  }
}
