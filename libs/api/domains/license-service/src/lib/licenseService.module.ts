import { Module } from '@nestjs/common'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { CmsModule } from '@island.is/cms'
import { MainResolver } from './graphql/main.resolver'
import {
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
  GenericLicenseOrganizationSlug,
  LICENSE_MAPPER_FACTORY,
  GenericLicenseMapper,
} from './licenceService.type'
import { AdrLicensePayloadMapper } from './mappers/adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from './mappers/disabilityLicenseMapper'
import { MachineLicensePayloadMapper } from './mappers/machineLicenseMapper'
import { FirearmLicensePayloadMapper } from './mappers/firearmLicenseMapper'
import { LicenseServiceService } from './licenseService.service'
import { LicenseMapperModule } from './mappers/licenseMapper.module'
import { DrivingLicensePayloadMapper } from './mappers/drivingLicenseMapper'
import { LicenseClientModule } from '@island.is/clients/license-client'

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
  {
    type: GenericLicenseType.PCard,
    provider: {
      id: GenericLicenseProviderId.DistrictCommissioners,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.PCard,
  },
]
@Module({
  imports: [LicenseClientModule, LicenseMapperModule, CmsModule],
  providers: [
    MainResolver,
    LicenseServiceService,
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: LICENSE_MAPPER_FACTORY,
      useFactory:
        (
          adr: AdrLicensePayloadMapper,
          disability: DisabilityLicensePayloadMapper,
          machine: MachineLicensePayloadMapper,
          firearm: FirearmLicensePayloadMapper,
          driving: DrivingLicensePayloadMapper,
        ) =>
        async (
          type: GenericLicenseType,
        ): Promise<GenericLicenseMapper | null> => {
          switch (type) {
            case GenericLicenseType.AdrLicense:
              return adr
            case GenericLicenseType.DisabilityLicense:
              return disability
            case GenericLicenseType.MachineLicense:
              return machine
            case GenericLicenseType.FirearmLicense:
              return firearm
            case GenericLicenseType.DriversLicense:
              return driving
            default:
              return null
          }
        },
      inject: [
        AdrLicensePayloadMapper,
        DisabilityLicensePayloadMapper,
        MachineLicensePayloadMapper,
        FirearmLicensePayloadMapper,
        DrivingLicensePayloadMapper,
      ],
    },
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
