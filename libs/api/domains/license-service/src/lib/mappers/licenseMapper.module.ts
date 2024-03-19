import { Module } from '@nestjs/common'
import { AdrLicensePayloadMapper } from '../mappers/adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from '../mappers/disabilityLicenseMapper'
import { FirearmLicensePayloadMapper } from '../mappers/firearmLicenseMapper'
import { MachineLicensePayloadMapper } from '../mappers/machineLicenseMapper'
import { DrivingLicensePayloadMapper } from '../mappers/drivingLicenseMapper'
import { PCardPayloadMapper } from '../mappers/pCardMapper'
import { EHICCardPayloadMapper } from '../mappers/ehicCardMapper'
import { HuntingLicensePayloadMapper } from '../mappers/huntingLicenseMapper'

@Module({
  providers: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
    DrivingLicensePayloadMapper,
    HuntingLicensePayloadMapper,
    PCardPayloadMapper,
    EHICCardPayloadMapper,
  ],
  exports: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
    DrivingLicensePayloadMapper,
    HuntingLicensePayloadMapper,
    PCardPayloadMapper,
    EHICCardPayloadMapper,
  ],
})
export class LicenseMapperModule {}
