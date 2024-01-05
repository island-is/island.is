import { Module } from '@nestjs/common'
import { AdrLicensePayloadMapper } from './adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from './disabilityLicenseMapper'
import { FirearmLicensePayloadMapper } from './firearmLicenseMapper'
import { MachineLicensePayloadMapper } from './machineLicenseMapper'
import { DrivingLicensePayloadMapper } from './drivingLicenseMapper'
import { PCardPayloadMapper } from './pCardMapper'
import { EHICCardPayloadMapper } from './ehicCardMapper'

@Module({
  providers: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
    DrivingLicensePayloadMapper,
    PCardPayloadMapper,
    EHICCardPayloadMapper,
  ],
  exports: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
    DrivingLicensePayloadMapper,
    PCardPayloadMapper,
    EHICCardPayloadMapper,
  ],
})
export class LicenseMapperModule {}
