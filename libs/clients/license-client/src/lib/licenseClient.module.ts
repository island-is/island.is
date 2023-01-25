import { FirearmLicenseClientModule } from '@island.is/clients/firearm-license'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { XRoadConfig } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  CONFIG_PROVIDER,
  PassTemplateIds,
  LICENSE_CLIENT_FACTORY,
  LicenseType,
  LicenseClient,
} from './licenseClient.type'
import {
  FirearmLicenseClient,
  FirearmLicenseClientApiConfig,
} from './firearm-license-client'
import { LicenseClientService } from './licenseClient.service'

@Module({
  imports: [FirearmLicenseClientModule],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: CONFIG_PROVIDER,
      useFactory: (
        firearmConfig: ConfigType<typeof FirearmLicenseClientApiConfig>,
      ) => {
        const ids: PassTemplateIds = {
          firearmLicense: firearmConfig.passTemplateId,
        }
        return ids
      },
      inject: [FirearmLicenseClientApiConfig.KEY],
    },
    {
      provide: LICENSE_CLIENT_FACTORY,
      useFactory: (firearmClient: FirearmLicenseClient) => async (
        type: LicenseType,
      ): Promise<LicenseClient<unknown> | null> => {
        switch (type) {
          case LicenseType.FirearmLicense:
            return firearmClient
          default:
            return null
        }
      },
      inject: [FirearmLicenseClient, XRoadConfig.KEY],
    },
  ],
  exports: [LicenseClientService],
})
export class LicenseClientModule {}
