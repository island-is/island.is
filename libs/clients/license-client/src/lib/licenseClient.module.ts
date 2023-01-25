import { FirearmLicenseClientModule } from '@island.is/clients/firearm-license'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { XRoadConfig } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  CONFIG_PROVIDER,
  PassTemplateIds,
  GENERIC_LICENSE_FACTORY,
  GenericLicenseType,
  GenericLicenseClient,
} from './licenseClient.type'
import {
  FirearmLicenseClient,
  FirearmLicenseClientApiConfig,
} from './firearm-license-client'

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
      provide: LICENSE_FACTORY,
      useFactory: (firearmClient: FirearmLicenseClient) => async (
        type: GenericLicenseType,
      ): Promise<GenericLicenseClient<unknown> | null> => {
        switch (type) {
          case GenericLicenseType.FirearmLicense:
            return firearmClient
          default:
            return null
        }
      },
      inject: [FirearmLicenseClient, XRoadConfig.KEY],
    },
  ],
  exports: [GEEN],
})
export class LicenseServiceModule {}
