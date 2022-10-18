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
  GenericLicenseOrganizationSlug,
  GENERIC_LICENSE_FACTORY,
} from './licenceService.type'
import {
  AdrApi,
  VinnuvelaApi,
  AdrAndMachineLicenseClientModule,
} from '@island.is/clients/adr-and-machine-license'
import { CmsModule } from '@island.is/cms'
import {
  DefaultApi as DisabilityApi,
  DisabilityLicenseClientModule,
} from '@island.is/clients/disability-license'
import { GenericDisabilityLicenseApi } from './client/disability-license-client'
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
  disabilityLicense: PkPassConfig
}

export type LicenseServiceConfigV2 = Omit<
  LicenseServiceConfig,
  'driversLicense'
>

export const AVAILABLE_LICENSES: GenericLicenseMetadata[] = [
  {
    type: GenericLicenseType.DriversLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.DriversLicense,
  },
  {
    type: GenericLicenseType.AdrLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.AdrLicense,
  },
  {
    type: GenericLicenseType.MachineLicense,

    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.MachineLicense,
  },
  {
    type: GenericLicenseType.FirearmLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.FirearmLicense,
  },
  {
    type: GenericLicenseType.DisabilityLicense,
    provider: {
      id: GenericLicenseProviderId.SocialInsuranceAdministration,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.DisabilityLicense,
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
        DisabilityLicenseClientModule,
        SmartSolutionsClientModule,
        CmsModule,
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
            disabilityApi: DisabilityApi,
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
              case GenericLicenseType.DisabilityLicense:
                return new GenericDisabilityLicenseApi(
                  logger,
                  disabilityApi,
                  new SmartSolutionsApi(logger, config.disabilityLicense),
                )
              default:
                return null
            }
          },
          inject: [AdrApi, VinnuvelaApi, FirearmApi, DisabilityApi],
        },
      ],
      exports: [LicenseServiceService],
    }
  }
}
