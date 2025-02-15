import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { Module } from '@nestjs/common'
import {
  LicenseType,
  LICENSE_UPDATE_CLIENT_FACTORY,
  LICENSE_UPDATE_CLIENT_FACTORY_V2,
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
import { BaseLicenseUpdateClient } from './clients/base/baseLicenseUpdateClient'
import {
  DrivingLicenseUpdateClient,
  DrivingUpdateClientModule,
} from './clients/driving-license-client'
import { BaseLicenseUpdateClientV2 } from './clients/base/licenseUpdateClientV2'
import { FirearmLicenseUpdateClientV2 } from './clients/firearm-license-client/services/firearmLicenseUpdateClientV2.service'
import { DisabilityLicenseUpdateClientV2 } from './clients/disability-license-client/services/disabilityLicenseUpdateClientV2.service'
import { DrivingLicenseUpdateClientV2 } from './clients/driving-license-client/services/drivingLicenseUpdateClientV2.service'

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
    {
      provide: LICENSE_UPDATE_CLIENT_FACTORY_V2,
      useFactory:
        (
          firearmClient: FirearmLicenseUpdateClientV2,
          disabilityClient: DisabilityLicenseUpdateClientV2,
          drivingClient: DrivingLicenseUpdateClientV2,
        ) =>
        async (
          type: LicenseType,
        ): Promise<BaseLicenseUpdateClientV2 | null> => {
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
        FirearmLicenseUpdateClientV2,
        DisabilityLicenseUpdateClientV2,
        DrivingLicenseUpdateClientV2,
      ],
    },
  ],
  exports: [LicenseUpdateClientService],
})
export class LicenseUpdateClientModule {}
