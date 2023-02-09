import { Module } from '@nestjs/common'
import { AdrLicensePayloadMapper } from './adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from './disabilityLicenseMapper'
import { FirearmLicensePayloadMapper } from './firearmLicenseMapper'
import { MachineLicensePayloadMapper } from './machineLicenseMapper'
import { DrivingLicensePayloadMapper } from './drivingLicenseMapper'

@Module({
  providers: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
    DrivingLicensePayloadMapper,
  ],
  exports: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
    DrivingLicensePayloadMapper,
  ],
})
export class LicenseMapperModule {}
