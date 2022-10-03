import { Cache as CacheManager } from 'cache-manager'
import { Module, DynamicModule, CacheModule } from '@nestjs/common'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'

import { LicenseServiceService } from './licenseService.service'

import { MainResolver } from './graphql/main.resolver'

import { GenericDrivingLicenseApi } from './client/driving-license-client'
import { GenericAdrLicenseApi } from './client/adr-license-client/adrLicenseService.api'
import { GenericMachineLicenseApi } from './client/machine-license-client'
import { GenericFirearmLicenseApi } from './client/firearm-license-client'
import {
  FirearmApi,
  FirearmLicenseClientModule,
} from '@island.is/clients/firearm-license'
import {
  SmartSolutionsApi,
  SmartSolutionsClientModule,
} from '@island.is/clients/smartsolutions'
import {
  CONFIG_PROVIDER,
  CONFIG_PROVIDER_V2,
  GenericLicenseClient,
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
  GENERIC_LICENSE_FACTORY,
} from './licenceService.type'
import {
  AdrApi,
  VinnuvelaApi,
  AdrAndMachineLicenseClientModule,
} from '@island.is/clients/adr-and-machine-license'
export interface PkPassConfig {
  apiKey: string
  apiUrl: string
  passTemplateId?: string
  secretKey?: string
  cacheKey?: string
  cacheTokenExpiryDelta?: string
  authRetries?: string
}
export interface DriversLicenseConfig {
  xroad: {
    baseUrl: string
    clientId: string
    path: string
    secret: string
  }
  pkpass: PkPassConfig
}
export interface LicenseServiceConfig {
  firearmLicense: PkPassConfig
  driversLicense: DriversLicenseConfig
  adrLicense: PkPassConfig
  machineLicense: PkPassConfig
}

export type LicenseServiceConfigV2 = Omit<
  LicenseServiceConfig,
  'driversLicense'
>

//TODO: Translate all strings (Ásdís Erna Guðmundsdóttir /disaerna)
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
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
  {
    type: GenericLicenseType.MachineLicense,

    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
  {
    type: GenericLicenseType.FirearmLicense,
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
  static register(config: LicenseServiceConfig): DynamicModule {
    return {
      module: LicenseServiceModule,
      imports: [
        CacheModule.register(),
        AdrAndMachineLicenseClientModule,
        FirearmLicenseClientModule,
        SmartSolutionsClientModule,
      ],
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
          provide: CONFIG_PROVIDER_V2,
          useValue: config as LicenseServiceConfigV2,
        },
        {
          provide: GENERIC_LICENSE_FACTORY,
          useFactory: (
            adrApi: AdrApi,
            machineApi: VinnuvelaApi,
            firearmApi: FirearmApi,
          ) => async (
            type: GenericLicenseType,
            cacheManager: CacheManager,
          ): Promise<GenericLicenseClient<unknown> | null> => {
            switch (type) {
              case GenericLicenseType.DriversLicense:
                return new GenericDrivingLicenseApi(
                  logger,
                  config.driversLicense,
                  cacheManager,
                )
              case GenericLicenseType.AdrLicense:
                return new GenericAdrLicenseApi(
                  logger,
                  adrApi,
                  new SmartSolutionsApi(logger, config.adrLicense),
                )
              case GenericLicenseType.MachineLicense:
                return new GenericMachineLicenseApi(
                  logger,
                  machineApi,
                  new SmartSolutionsApi(logger, config.machineLicense),
                )
              case GenericLicenseType.FirearmLicense:
                return new GenericFirearmLicenseApi(
                  logger,
                  firearmApi,
                  new SmartSolutionsApi(logger, config.firearmLicense),
                )
              default:
                return null
            }
          },
          inject: [AdrApi, VinnuvelaApi, FirearmApi],
        },
      ],
      exports: [LicenseServiceService],
    }
  }
}
