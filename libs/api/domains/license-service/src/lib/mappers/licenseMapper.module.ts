import { Module } from '@nestjs/common'
import { AdrLicensePayloadMapper } from '../mappers/adrLicenseMapper'
import { DisabilityLicensePayloadMapper } from '../mappers/disabilityLicenseMapper'
import { FirearmLicensePayloadMapper } from '../mappers/firearmLicenseMapper'
import { MachineLicensePayloadMapper } from '../mappers/machineLicenseMapper'
import { DrivingLicensePayloadMapper } from '../mappers/drivingLicenseMapper'
import { PCardPayloadMapper } from '../mappers/pCardMapper'
import { EHICCardPayloadMapper } from '../mappers/ehicCardMapper'
import { HuntingLicensePayloadMapper } from '../mappers/huntingLicenseMapper'
import { PassportMapper } from '../mappers/passportMapper'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { IdentityDocumentMapper } from './identityDocumentMapper'

@Module({
  imports: [CmsTranslationsModule],
  providers: [
    AdrLicensePayloadMapper,
    FirearmLicensePayloadMapper,
    DisabilityLicensePayloadMapper,
    MachineLicensePayloadMapper,
    DrivingLicensePayloadMapper,
    HuntingLicensePayloadMapper,
    PCardPayloadMapper,
    EHICCardPayloadMapper,
    PassportMapper,
    IdentityDocumentMapper,
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
    PassportMapper,
    IdentityDocumentMapper,
  ],
})
export class LicenseMapperModule {}
