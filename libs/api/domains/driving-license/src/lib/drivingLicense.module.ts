import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { DrivingLicenseService } from './drivingLicense.service'
import {
  DrivingLicenseConfig,
  DrivingLicenseApiModule,
} from '@island.is/clients/driving-license'

export type Config = DrivingLicenseConfig

@Module({})
export class DrivingLicenseModule {
  static register(config: DrivingLicenseConfig): DynamicModule {
    return {
      module: DrivingLicenseModule,
      providers: [MainResolver, DrivingLicenseService],
      imports: [DrivingLicenseApiModule.register(config)],
      exports: [DrivingLicenseService],
    }
  }
}
