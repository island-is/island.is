import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  CONFIG_PROVIDER,
  LicenseType,
  LICENSE_UPDATE_CLIENT_FACTORY,
  LicenseUpdateClient,
} from './licenseClient.type'
import type { PassTemplateIds } from './licenseClient.type'
import { LicenseUpdateClientService } from './licenseUpdateClient.service'
import {
  FirearmDigitalLicenseClientConfig,
  FirearmLicenseUpdateClient,
} from './clients/firearm-license-client'
import { AdrDigitalLicenseClientConfig } from './clients/adr-license-client'
import { MachineDigitalLicenseClientConfig } from './clients/machine-license-client'
import {
  DisabilityDigitalLicenseClientConfig,
  DisabilityLicenseUpdateClient,
  DisabilityUpdateClientModule,
} from './clients/disability-license-client'
import { FirearmUpdateClientModule } from './clients/firearm-license-client/firearmLicenseUpdateClient.module'
import { PassTemplateIdsProvider } from './factories/passTemplateIdsFactory'

@Module({
  imports: [FirearmUpdateClientModule, DisabilityUpdateClientModule],
  providers: [
    LicenseUpdateClientService,
    PassTemplateIdsProvider,
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: CONFIG_PROVIDER,
      useFactory: (
        firearmConfig: ConfigType<typeof FirearmDigitalLicenseClientConfig>,
        adrConfig: ConfigType<typeof AdrDigitalLicenseClientConfig>,
        machineConfig: ConfigType<typeof MachineDigitalLicenseClientConfig>,
        disabilityConfig: ConfigType<
          typeof DisabilityDigitalLicenseClientConfig
        >,
      ) => {
        const ids: PassTemplateIds = {
          firearmLicense: firearmConfig.passTemplateId,
          adrLicense: adrConfig.passTemplateId,
          machineLicense: machineConfig.passTemplateId,
          disabilityLicense: disabilityConfig.passTemplateId,
        }
        return ids
      },
      inject: [
        FirearmDigitalLicenseClientConfig.KEY,
        AdrDigitalLicenseClientConfig.KEY,
        MachineDigitalLicenseClientConfig.KEY,
        DisabilityDigitalLicenseClientConfig.KEY,
      ],
    },
    {
      provide: LICENSE_UPDATE_CLIENT_FACTORY,
      useFactory: (
        firearmClient: FirearmLicenseUpdateClient,
        disabilityClient: DisabilityLicenseUpdateClient,
      ) => async (type: LicenseType): Promise<LicenseUpdateClient | null> => {
        switch (type) {
          case LicenseType.FirearmLicense:
            return firearmClient
          case LicenseType.DisabilityLicense:
            return disabilityClient
          default:
            return null
        }
      },
      inject: [FirearmLicenseUpdateClient, DisabilityLicenseUpdateClient],
    },
  ],
  exports: [LicenseUpdateClientService],
})
export class LicenseUpdateClientModule {}
