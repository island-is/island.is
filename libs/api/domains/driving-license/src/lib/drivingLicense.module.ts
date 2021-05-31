import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { DrivingLicenseService } from './drivingLicense.service'
import { DrivingLicenseApi } from './client'

export interface Config {
  xroadBaseUrl: string
  xroadClientId: string
  secret: string
}

@Module({})
export class DrivingLicenseModule {
  static register(config: Config): DynamicModule {
    return {
      module: DrivingLicenseModule,
      providers: [
        MainResolver,
        DrivingLicenseService,
        {
          provide: DrivingLicenseApi,
          useFactory: async () =>
            new DrivingLicenseApi(
              config.xroadBaseUrl,
              config.xroadClientId,
              config.secret,
            ),
        },
      ],
      exports: [DrivingLicenseService],
    }
  }
}
