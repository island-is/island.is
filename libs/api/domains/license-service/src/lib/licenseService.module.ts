import { Module, CacheModule } from '@nestjs/common'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { CmsModule } from '@island.is/cms'
import { LicenseServiceService } from './licenseService.service'
import { LicenseClientModule } from '@island.is/clients/license-client'
import { MainResolver } from './graphql/main.resolver'
//import { LicenseClientModule } from '@island.is/clients/license'
import {
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
  GenericLicenseOrganizationSlug,
  LICENSE_MAPPER_FACTORY,
} from './licenceService.type'
import { GenericDrivingLicenseModule } from './client/driving-license-client'
import {
  AdrLicensePayloadMapper,
  parseAdrLicensePayload,
} from './mappers/adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from './mappers/disabilityLicenseMapper'
import { MachineLicensePayloadMapper } from './mappers/machineLicenseMapper'
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
    GenericDrivingLicenseModule,
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
      provide: LICENSE_MAPPER_FACTORY,
      useFactory: (type: GenericLicenseType) => {
        switch (type) {
          case GenericLicenseType.AdrLicense:
            return AdrLicensePayloadMapper
          case GenericLicenseType.DisabilityLicense:
            return DisabilityLicensePayloadMapper
          case GenericLicenseType.MachineLicense:
            return MachineLicensePayloadMapper
          default:
            return null
        }
      },
    },
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
