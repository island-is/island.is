import { Cache as CacheManager } from 'cache-manager'
import { Module, CacheModule } from '@nestjs/common'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { CmsModule } from '@island.is/cms'
import { LicenseServiceService } from './licenseService.service'
import { MainResolver } from './graphql/main.resolver'
import {
  CONFIG_PROVIDER,
  GenericLicenseClient,
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
  GenericLicenseOrganizationSlug,
  GENERIC_LICENSE_FACTORY,
  PassTemplateIds,
} from './licenceService.type'
import {
  GenericAdrLicenseModule,
  GenericAdrLicenseService,
  GenericAdrLicenseConfig,
} from './client/adr-license-client'
import {
  GenericFirearmLicenseModule,
  GenericFirearmLicenseService,
  GenericFirearmLicenseConfig,
} from './client/firearm-license-client'
import {
  GenericMachineLicenseModule,
  GenericMachineLicenseService,
  GenericMachineLicenseConfig,
} from './client/machine-license-client'

import {
  GenericDrivingLicenseApi,
  GenericDrivingLicenseConfig,
} from './client/driving-license-client'

export const AVAILABLE_LICENSES: GenericLicenseMetadata[] = [
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
]
@Module({
  imports: [
    CacheModule.register(),
    GenericFirearmLicenseModule,
    GenericAdrLicenseModule,
    GenericMachineLicenseModule,
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
      useFactory: (
        firearmConfig: ConfigType<typeof GenericFirearmLicenseConfig>,
        adrConfig: ConfigType<typeof GenericAdrLicenseConfig>,
        machineConfig: ConfigType<typeof GenericMachineLicenseConfig>,
      ) => {
        const ids: PassTemplateIds = {
          firearmLicense: firearmConfig.passTemplateId,
          adrLicense: adrConfig.passTemplateId,
          machineLicense: machineConfig.passTemplateId,
        }
        return ids
      },
      inject: [
        GenericFirearmLicenseConfig.KEY,
        GenericAdrLicenseConfig.KEY,
        GenericMachineLicenseConfig.KEY,
      ],
    },
    {
      provide: GENERIC_LICENSE_FACTORY,
      useFactory: (
        genericFirearmService: GenericFirearmLicenseService,
        genericAdrService: GenericAdrLicenseService,
        genericMachineService: GenericMachineLicenseService,
        drivingLicenseConfig: ConfigType<typeof GenericDrivingLicenseConfig>,
        xRoadConfig: ConfigType<typeof XRoadConfig>,
      ) => async (
        type: GenericLicenseType,
        cacheManager: CacheManager,
      ): Promise<GenericLicenseClient<unknown> | null> => {
        switch (type) {
          case GenericLicenseType.DriversLicense:
            return new GenericDrivingLicenseApi(
              logger,
              xRoadConfig,
              drivingLicenseConfig,
              cacheManager,
            )
          case GenericLicenseType.AdrLicense:
            return genericAdrService
          case GenericLicenseType.MachineLicense:
            return genericMachineService
          case GenericLicenseType.FirearmLicense:
            return genericFirearmService
          default:
            return null
        }
      },
      inject: [
        GenericFirearmLicenseService,
        GenericAdrLicenseService,
        GenericMachineLicenseService,
        GenericDrivingLicenseConfig.KEY,
        XRoadConfig.KEY,
      ],
    },
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
