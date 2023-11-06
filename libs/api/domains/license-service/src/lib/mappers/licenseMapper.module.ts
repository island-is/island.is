import { Module } from '@nestjs/common'
import { AdrLicensePayloadMapper } from './adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from './disabilityLicenseMapper'
import { FirearmLicensePayloadMapper } from './firearmLicenseMapper'
import { MachineLicensePayloadMapper } from './machineLicenseMapper'
import { DrivingLicensePayloadMapper } from './drivingLicenseMapper'
import { PCardPayloadMapper } from './pCardMapper'

@Module({
  providers: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
    DrivingLicensePayloadMapper,
    PCardPayloadMapper,
  ],
  exports: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
    DrivingLicensePayloadMapper,
    PCardPayloadMapper,
  ],
})
export class LicenseMapperModule {}
