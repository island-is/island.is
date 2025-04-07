import { FactoryProvider } from '@nestjs/common'
import {
  GenericLicenseMapper,
  GenericLicenseType,
} from '../licenceService.type'
import { LICENSE_MAPPER_FACTORY } from '../licenseService.constants'
import { AdrLicensePayloadMapper } from '../mappers/adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from '../mappers/disabilityLicenseMapper'
import { DrivingLicensePayloadMapper } from '../mappers/drivingLicenseMapper'
import { EHICCardPayloadMapper } from '../mappers/ehicCardMapper'
import { FirearmLicensePayloadMapper } from '../mappers/firearmLicenseMapper'
import { MachineLicensePayloadMapper } from '../mappers/machineLicenseMapper'
import { PCardPayloadMapper } from '../mappers/pCardMapper'
import { HuntingLicensePayloadMapper } from '../mappers/huntingLicenseMapper'
import { PassportMapper } from '../mappers/passportMapper'
import { IdentityDocumentMapper } from '../mappers/identityDocumentMapper'

export const LicenseMapperProvider: FactoryProvider = {
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
      hunting: HuntingLicensePayloadMapper,
      passport: PassportMapper,
      identityDocument: IdentityDocumentMapper,
    ) =>
    async (type: GenericLicenseType): Promise<GenericLicenseMapper | null> => {
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
        case GenericLicenseType.HuntingLicense:
          return hunting
        case GenericLicenseType.PCard:
          return pCard
        case GenericLicenseType.Ehic:
          return ehic
        case GenericLicenseType.Passport:
          return passport
        case GenericLicenseType.IdentityDocument:
          return identityDocument
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
    HuntingLicensePayloadMapper,
    PassportMapper,
    IdentityDocumentMapper,
  ],
}
