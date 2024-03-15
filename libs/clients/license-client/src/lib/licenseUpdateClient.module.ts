import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { Module } from '@nestjs/common'
import {
  LicenseType,
  LICENSE_UPDATE_CLIENT_FACTORY,
} from './licenseClient.type'
import { LicenseUpdateClientService } from './licenseUpdateClient.service'
import {
  FirearmLicenseUpdateClient,
  FirearmUpdateClientModule,
} from './clients/firearm-license-client'
import {
  DisabilityLicenseUpdateClient,
  DisabilityUpdateClientModule,
} from './clients/disability-license-client'
import { PassTemplateIdsProvider } from './providers/passTemplateIdsProvider'
import { BaseLicenseUpdateClient } from './clients/baseLicenseUpdateClient'
import {
  DrivingLicenseUpdateClient,
  DrivingUpdateClientModule,
} from './clients/driving-license-client'

@Module({
  imports: [
    FirearmUpdateClientModule,
    DisabilityUpdateClientModule,
    DrivingUpdateClientModule,
  ],
  providers: [
    LicenseUpdateClientService,
    PassTemplateIdsProvider,
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    PassTemplateIdsProvider,
    {
      provide: LICENSE_UPDATE_CLIENT_FACTORY,
      useFactory:
        (
          firearmClient: FirearmLicenseUpdateClient,
          disabilityClient: DisabilityLicenseUpdateClient,
          drivingClient: DrivingLicenseUpdateClient,
        ) =>
        async (type: LicenseType): Promise<BaseLicenseUpdateClient | null> => {
          switch (type) {
            case LicenseType.FirearmLicense:
              return firearmClient
            case LicenseType.DisabilityLicense:
              return disabilityClient
            case LicenseType.DrivingLicense:
              return drivingClient
            default:
              return null
          }
        },
      inject: [
        FirearmLicenseUpdateClient,
        DisabilityLicenseUpdateClient,
        DrivingLicenseUpdateClient,
      ],
    },
  ],
  exports: [LicenseUpdateClientService],
})
export class LicenseUpdateClientModule {}
