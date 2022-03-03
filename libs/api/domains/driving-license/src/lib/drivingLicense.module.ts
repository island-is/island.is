import { DynamicModule,Module } from '@nestjs/common'

import {
  DrivingLicenseApiConfig,
  DrivingLicenseApiModule,
} from '@island.is/clients/driving-license'

import { DrivingLicenseService } from './drivingLicense.service'
import { MainResolver, QualityPhotoResolver } from './graphql'

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
