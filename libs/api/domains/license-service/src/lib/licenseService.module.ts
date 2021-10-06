import { Cache as CacheManager } from 'cache-manager'
import { Module, DynamicModule, CacheModule } from '@nestjs/common'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'

import { LicenseServiceService } from './licenseService.service'

import { MainResolver } from './graphql/main.resolver'

import { GenericDrivingLicenseApi } from './client/driving-license-client'
import {
  CONFIG_PROVIDER,
  GenericLicenseClient,
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
  GENERIC_LICENSE_FACTORY,
} from './licenceService.type'

export interface Config {
  xroad: {
    baseUrl: string
    clientId: string
    path: string
    secret: string
  }
  pkpass: {
    apiKey: string
    apiUrl: string
    secretKey: string
    cacheKey: string
    cacheTokenExpiryDelta: string
    authRetries: string
  }
}

export const AVAILABLE_LICENSES: GenericLicenseMetadata[] = [
  {
    type: GenericLicenseType.DriversLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
]

@Module({})
export class LicenseServiceModule {
  static register(config: Config): DynamicModule {
    return {
      module: LicenseServiceModule,
      imports: [CacheModule.register()],
      providers: [
        MainResolver,
        LicenseServiceService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: CONFIG_PROVIDER,
          useValue: config,
        },
        {
          provide: GENERIC_LICENSE_FACTORY,
          useFactory: () => async (
            type: GenericLicenseType,
            cacheManager: CacheManager,
          ): Promise<GenericLicenseClient<unknown> | null> => {
            switch (type) {
              case GenericLicenseType.DriversLicense:
                return new GenericDrivingLicenseApi(
                  config,
                  logger,
                  cacheManager,
                )
              default:
                return null
            }
          },
        },
      ],
      exports: [LicenseServiceService],
    }
  }
}
