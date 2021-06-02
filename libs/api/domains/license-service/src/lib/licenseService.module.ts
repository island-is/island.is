import { Module, DynamicModule } from '@nestjs/common'

import { LicenseServiceService } from './licenseService.service'
import { LicenseServiceApi } from './client'
import { MainResolver } from './graphql/main.resolver'

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
          provide: LicenseServiceApi,
          useFactory: async () =>
            new LicenseServiceApi(
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
