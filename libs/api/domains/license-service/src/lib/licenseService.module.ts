import { Module, DynamicModule } from '@nestjs/common'

import { LicenseServiceService } from './licenseService.service'

import { MainResolver } from './graphql/main.resolver'

import { GenericDrivingLicenseApi } from './client/driving-license-client'

export interface Config {
  xroad: {
    xroadBaseUrl: string
    xroadClientId: string
    drivingLicenseSecret: string
  }
}

@Module({})
export class LicenseServiceModule {
  static register(config: Config): DynamicModule {
    return {
      module: LicenseServiceModule,
      providers: [
        MainResolver,
        LicenseServiceService,
        {
          provide: GenericDrivingLicenseApi,
          useFactory: async () =>
            new GenericDrivingLicenseApi(
              config.xroad.xroadBaseUrl,
              config.xroad.xroadClientId,
              config.xroad.drivingLicenseSecret,
            ),
        },
      ],
      exports: [LicenseServiceService],
    }
  }
}
