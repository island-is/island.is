import { Cache as CacheManager } from 'cache-manager'
import { Module, CacheModule } from '@nestjs/common'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { CmsModule } from '@island.is/cms'
import { LicenseServiceService } from './licenseService.service'
import { LicenseClientModule } from '@island.is/clients/license-client'
import { MainResolver } from './graphql/main.resolver'
//import { LicenseClientModule } from '@island.is/clients/license'
import {
  GenericLicenseClient,
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
  GenericLicenseOrganizationSlug,
  DRIVING_LICENSE_FACTORY,
} from './licenceService.type'
import { GenericAdrLicenseModule } from './client/adr-license-client'
import { GenericFirearmLicenseModule } from './client/firearm-license-client'
import { GenericMachineLicenseModule } from './client/machine-license-client'

import {
  GenericDrivingLicenseApi,
  GenericDrivingLicenseConfig,
} from './client/driving-license-client'
import { GenericDisabilityLicenseModule } from './client/disability-license-client'

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
  {
    type: GenericLicenseType.DisabilityLicense,
    provider: {
      id: GenericLicenseProviderId.SocialInsuranceAdministration,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.DisabilityLicense,
  },
]
@Module({
  imports: [
    CacheModule.register(),
    GenericFirearmLicenseModule,
    GenericAdrLicenseModule,
    GenericMachineLicenseModule,
    GenericDisabilityLicenseModule,
    LicenseClientModule,
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
      provide: DRIVING_LICENSE_FACTORY,
      useFactory: (
        drivingLicenseConfig: ConfigType<typeof GenericDrivingLicenseConfig>,
        xRoadConfig: ConfigType<typeof XRoadConfig>,
      ) => async (
        cacheManager: CacheManager,
      ): Promise<GenericLicenseClient<unknown> | null> =>
        new GenericDrivingLicenseApi(
          logger,
          xRoadConfig,
          drivingLicenseConfig,
          cacheManager,
        ),
      inject: [GenericDrivingLicenseConfig.KEY, XRoadConfig.KEY],
    },
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
