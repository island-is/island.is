import { Module, DynamicModule } from '@nestjs/common'

import { DrivingLicenseResolver } from './driving-license.resolver'
import { DrivingLicenseService } from './driving-license.service'
import { DrivingLicenseApi } from './client'

export interface Config {
  baseApiUrl: string
}

@Module({})
export class DrivingLicenseModule {
  static register(config: Config): DynamicModule {
    return {
      module: DrivingLicenseModule,
      providers: [
        DrivingLicenseResolver,
        DrivingLicenseService,
        {
          provide: DrivingLicenseApi,
          useFactory: async () => new DrivingLicenseApi(config.baseApiUrl),
        },
      ],
      exports: [],
    }
  }
}
