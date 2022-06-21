import { Cache as CacheManager } from 'cache-manager'
import { Module, DynamicModule, CacheModule } from '@nestjs/common'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'

import { LicenseServiceService } from './licenseService.service'

import { MainResolver } from './graphql/main.resolver'

import { GenericDrivingLicenseApi } from './client/driving-license-client'
import { GenericAdrLicenseApi } from './client/adr-license-client/adrLicenseService.api'
import {
  CONFIG_PROVIDER,
  GenericLicenseClient,
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
  GENERIC_LICENSE_FACTORY,
} from './licenceService.type'
import { User } from '@island.is/auth-nest-tools'
import {
  AdrApi,
  VinnuvelaApi,
  AdrApiProvider,
  AoshClientModule,
  MachineApiProvider,
} from '@island.is/clients/aosh'
import { GenericMachineLicenseApi } from './client/machine-license-client'

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
  {
    type: GenericLicenseType.AdrLicense,
    provider: {
      id: GenericLicenseProviderId.AOSH,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
  },
  {
    type: GenericLicenseType.MachineLicense,
    provider: {
      id: GenericLicenseProviderId.AOSH,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
  },
]
@Module({})
export class LicenseServiceModule {
  static register(config: Config): DynamicModule {
    return {
      module: LicenseServiceModule,
      imports: [CacheModule.register(), AoshClientModule],
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
          provide: 'adrProvider',
          useValue: AdrApiProvider,
        },
        {
          provide: 'machineProvider',
          useValue: MachineApiProvider,
        },
        {
          provide: GENERIC_LICENSE_FACTORY,
          useFactory: () => async (
            type: GenericLicenseType,
            cacheManager: CacheManager,
            user: User,
          ): Promise<GenericLicenseClient<unknown> | null> => {
            switch (type) {
              case GenericLicenseType.DriversLicense:
                return new GenericDrivingLicenseApi(
                  config,
                  logger,
                  cacheManager,
                )
              case GenericLicenseType.AdrLicense:
                return new GenericAdrLicenseApi(
                  logger,
                  AdrApiProvider,
                  cacheManager,
                )
              /*case GenericLicenseType.MachineLicense:
                return new GenericMachineLicenseApi(
                  logger,
                  machineApi,
                  cacheManager,
                )*/
              default:
                return null
            }
          },
          inject: [AdrApiProvider, VinnuvelaApi],
        },
      ],
      exports: [LicenseServiceService],
    }
  }
}
