import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { DrivingLicenseService } from './drivingLicense.service'
import {
  DrivingLicenseV1Config,
  DrivingLicenseApiV1Module,
} from '@island.is/clients/driving-license-v1'
import {
  DrivingLicenseApiV2Module,
  DrivingLicenseV2Config,
} from '@island.is/clients/driving-license-v2'

export interface Config {
  v1: DrivingLicenseV1Config
  v2: DrivingLicenseV2Config
}

@Module({})
export class DrivingLicenseModule {
  static register(config: Config): DynamicModule {
    if (!config.v1 || !config.v2) {
      throw new Error('v1 or v2 config missing')
    }

    return {
      module: DrivingLicenseModule,
      providers: [MainResolver, DrivingLicenseService],
      imports: [
        DrivingLicenseApiV1Module.register(config.v1),
        DrivingLicenseApiV2Module.register(config.v2),
      ],
      exports: [DrivingLicenseService],
    }
  }
}
