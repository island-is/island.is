import { Module } from '@nestjs/common'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { CmsModule } from '@island.is/cms'
import { MainResolver } from '../../../license-service/src/lib/graphql/main.resolver'
import {
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
  GenericLicenseOrganizationSlug,
  LICENSE_MAPPER_FACTORY,
  GenericLicenseMapper,
} from '../../../license-service/src/lib/licenceService.type'
import { AdrLicensePayloadMapper } from '../../../license-service/src/lib/mappers/adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from '../../../license-service/src/lib/mappers/disabilityLicenseMapper'
import { MachineLicensePayloadMapper } from '../../../license-service/src/lib/mappers/machineLicenseMapper'
import { FirearmLicensePayloadMapper } from '../../../license-service/src/lib/mappers/firearmLicenseMapper'
import { LicenseServiceService } from '../../../license-service/src/lib/licenseService.service'
import { LicenseMapperModule } from '../../../license-service/src/lib/mappers/licenseMapper.module'
import { DrivingLicensePayloadMapper } from '../../../license-service/src/lib/mappers/drivingLicenseMapper'
import { LicenseClientModule } from '@island.is/clients/license-client'
import { PCardPayloadMapper } from '../../../license-service/src/lib/mappers/pCardMapper'
import { EHICCardPayloadMapper } from '../../../license-service/src/lib/mappers/ehicCardMapper'

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
  {
    type: GenericLicenseType.Ehic,
    provider: {
      id: GenericLicenseProviderId.IcelandicHealthInsurance,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.EHIC,
  },
  {
    type: GenericLicenseType.Passport,
    provider: {
      id: GenericLicenseProviderId.RegistersIceland,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.Passport,
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
          pCard: PCardPayloadMapper,
          ehic: EHICCardPayloadMapper,
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
            case GenericLicenseType.PCard:
              return pCard
            case GenericLicenseType.Ehic:
              return ehic
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
        PCardPayloadMapper,
        EHICCardPayloadMapper,
      ],
    },
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
