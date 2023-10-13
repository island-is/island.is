import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { Module } from '@nestjs/common'
import {
  LICENSE_CLIENT_FACTORY,
  LicenseType,
  LicenseClient,
} from './licenseClient.type'
import { LicenseClientService } from './licenseClient.service'
import {
  FirearmClientModule,
  FirearmLicenseClient,
} from './clients/firearm-license-client'
import { AdrClientModule, AdrLicenseClient } from './clients/adr-license-client'
import {
  MachineClientModule,
  MachineLicenseClient,
} from './clients/machine-license-client'
import {
  DisabilityClientModule,
  DisabilityLicenseClient,
} from './clients/disability-license-client'
import { PassTemplateIdsProvider } from './providers/passTemplateIdsProvider'
import {
  DrivingClientModule,
  DrivingLicenseClient,
} from './clients/driving-license-client'

@Module({
  imports: [
    FirearmClientModule,
    AdrClientModule,
    MachineClientModule,
    DisabilityClientModule,
    DrivingClientModule,
  ],
  providers: [
    LicenseClientService,
    PassTemplateIdsProvider,
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: LICENSE_CLIENT_FACTORY,
      useFactory:
        (
          firearmClient: FirearmLicenseClient,
          adrClient: AdrLicenseClient,
          machineClient: MachineLicenseClient,
          disabilityClient: DisabilityLicenseClient,
          drivingClient: DrivingLicenseClient,
        ) =>
        async (type: LicenseType): Promise<LicenseClient<unknown> | null> => {
          switch (type) {
            case LicenseType.FirearmLicense:
              return firearmClient
            case LicenseType.DriversLicense:
              return drivingClient
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
        DrivingLicenseClient,
      ],
    },
  ],
  exports: [LicenseClientService],
})
export class LicenseClientModule {}
