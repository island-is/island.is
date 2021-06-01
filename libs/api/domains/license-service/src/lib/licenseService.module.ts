import { Module, DynamicModule } from '@nestjs/common'

import { LicenseServiceService } from './licenseService.service'
import { LicenseServiceResolver } from './licenseService.resolver'
import { DrivingLicenseApi } from './client'

export interface Config {
  xroadBaseUrl: string
  xroadClientId: string
  secret: string
}

@Module({})
export class LicenseServiceModule {
  static register(config: Config): DynamicModule {
    return {
      module: LicenseServiceModule,
      providers: [
        LicenseServiceResolver,
        LicenseServiceService,
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
      exports: [LicenseServiceService],
    }
  }
}
