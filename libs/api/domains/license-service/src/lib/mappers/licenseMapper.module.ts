import { Module } from '@nestjs/common'
import { AdrLicensePayloadMapper } from './adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from './disabilityLicenseMapper'
import { FirearmLicensePayloadMapper } from './firearmLicenseMapper'
import { MachineLicensePayloadMapper } from './machineLicenseMapper'

@Module({
  providers: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
  ],
  exports: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
  ],
})
export class LicenseMapperModule {}
