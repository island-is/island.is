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
  FirearmLicenseClientApiConfig,
} from './clients/firearm-license-client'
import {
  AdrClientModule,
  AdrLicenseClient,
  AdrLicenseClientApiConfig,
} from './clients/adr-license-client'
import {
  MachineClientModule,
  MachineLicenseClient,
  MachineLicenseClientApiConfig,
} from './clients/machine-license-client'
import {
  DisabilityClientModule,
  DisabilityLicenseClient,
  DisabilityLicenseClientApiConfig,
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
        firearmConfig: ConfigType<typeof FirearmLicenseClientApiConfig>,
        adrConfig: ConfigType<typeof AdrLicenseClientApiConfig>,
        machineConfig: ConfigType<typeof MachineLicenseClientApiConfig>,
        disabilityConfig: ConfigType<typeof DisabilityLicenseClientApiConfig>,
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
        FirearmLicenseClientApiConfig.KEY,
        AdrLicenseClientApiConfig.KEY,
        MachineLicenseClientApiConfig.KEY,
        DisabilityLicenseClientApiConfig.KEY,
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
