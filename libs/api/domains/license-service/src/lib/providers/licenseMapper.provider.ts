import { FactoryProvider } from '@nestjs/common'
import { GenericLicenseMapper } from '../licenceService.type'
import { LICENSE_MAPPER_FACTORY } from '../licenseService.constants'
import { AdrLicensePayloadMapper } from '../mappers/adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from '../mappers/disabilityLicenseMapper'
import { DrivingLicensePayloadMapper } from '../mappers/drivingLicenseMapper'
import { EHICCardPayloadMapper } from '../mappers/ehicCardMapper'
import { FirearmLicensePayloadMapper } from '../mappers/firearmLicenseMapper'
import { MachineLicensePayloadMapper } from '../mappers/machineLicenseMapper'
import { PCardPayloadMapper } from '../mappers/pCardMapper'
import { LicenseType } from '@island.is/shared/constants'

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
    ) =>
    async (type: LicenseType): Promise<GenericLicenseMapper | null> => {
      switch (type) {
        case LicenseType.AdrLicense:
          return adr
        case LicenseType.DisabilityLicense:
          return disability
        case LicenseType.MachineLicense:
          return machine
        case LicenseType.FirearmLicense:
          return firearm
        case LicenseType.DriversLicense:
          return driving
        case LicenseType.PCard:
          return pCard
        case LicenseType.Ehic:
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
}
