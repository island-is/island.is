import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver, QualityPhotoResolver } from './graphql'
import { DrivingLicenseService } from './drivingLicense.service'
import {
  DrivingLicenseApiModule,
  DrivingLicenseApiConfig,
} from '@island.is/clients/driving-license'

export interface Config {
  clientConfig: DrivingLicenseApiConfig
}

@Module({})
export class DrivingLicenseModule {
  static register(config: Config): DynamicModule {
    return {
      module: DrivingLicenseModule,
      providers: [MainResolver, QualityPhotoResolver, DrivingLicenseService],
      imports: [DrivingLicenseApiModule.register(config.clientConfig)],
      exports: [DrivingLicenseService],
    }
  }
}
