import { Module } from '@nestjs/common'
import { LicenseController } from './license.controller'
import { LicenseService } from './license.service'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { LicenseClientModule } from '@island.is/clients/license-client'
import { PASS_TEMPLATE_IDS, PassTemplateIds } from './license.types'
import { ConfigType } from '@nestjs/config'
import { FirearmLicenseApiClientConfig } from './clients/firearmLicense/firearmLicenseApiClient.config'
import { DisabilityLicenseApiClientConfig } from './clients/disabilityLicense/disabilityLicenseClient.config'

@Module({
  imports: [LicenseClientModule],
  controllers: [LicenseController],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: PASS_TEMPLATE_IDS,
      useFactory: (
        firearmConfig: ConfigType<typeof FirearmLicenseApiClientConfig>,
        disabilityConfig: ConfigType<typeof DisabilityLicenseApiClientConfig>,
      ) => {
        const ids: PassTemplateIds = {
          firearm: firearmConfig.passTemplateId,
          disability: disabilityConfig.passTemplateId,
        }
        return ids
      },
      inject: [
        FirearmLicenseApiClientConfig.KEY,
        DisabilityLicenseApiClientConfig.KEY,
      ],
    },
    LicenseService,
  ],
})
export class LicenseModule {}
