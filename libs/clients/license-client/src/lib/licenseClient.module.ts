import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { CacheModule, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  CONFIG_PROVIDER,
  LICENSE_CLIENT_FACTORY,
  LicenseType,
  LicenseClient,
} from './licenseClient.type'
import type { PassTemplateIds } from './licenseClient.type'
import { LicenseClientService } from './licenseClient.service'
import {
  FirearmClientModule,
  FirearmLicenseClient,
  FirearmDigitalLicenseClientConfig,
} from './clients/firearm-license-client'
import {
  AdrClientModule,
  AdrLicenseClient,
  AdrDigitalLicenseClientConfig,
} from './clients/adr-license-client'
import {
  MachineClientModule,
  MachineLicenseClient,
  MachineDigitalLicenseClientConfig,
} from './clients/machine-license-client'
import {
  DisabilityClientModule,
  DisabilityLicenseClient,
  DisabilityDigitalLicenseClientConfig,
} from './clients/disability-license-client'
import { DrivingClientModule } from './clients/driving-license-client/drivingLicenseClient.module'

@Module({
  imports: [
    CacheModule.register(),
    FirearmClientModule,
    AdrClientModule,
    MachineClientModule,
    DisabilityClientModule,
    DrivingClientModule,
  ],
  providers: [
    LicenseClientService,
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
      provide: LICENSE_CLIENT_FACTORY,
      useFactory: (
        firearmClient: FirearmLicenseClient,
        adrClient: AdrLicenseClient,
        machineClient: MachineLicenseClient,
        disabilityClient: DisabilityLicenseClient,
      ) => async (
        type: LicenseType,
      ): Promise<LicenseClient<unknown> | null> => {
        switch (type) {
          case LicenseType.FirearmLicense:
            return firearmClient
          case LicenseType.AdrLicense:
            return adrClient
          case LicenseType.MachineLicense:
            return machineClient
          case LicenseType.DisabilityLicense:
            return disabilityClient
          default:
            return null
        }
      },
      inject: [
        FirearmLicenseClient,
        AdrLicenseClient,
        MachineLicenseClient,
        DisabilityLicenseClient,
      ],
    },
  ],
  exports: [LicenseClientService],
})
export class LicenseClientModule {}
