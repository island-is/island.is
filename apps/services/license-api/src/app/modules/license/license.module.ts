import { Module } from '@nestjs/common'
import {
  LicensesController,
  UserLicensesController,
} from './license.controller'
import { LicenseService } from './license.service'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { ConfigType } from '@nestjs/config'
import {
  DisabilityLicenseApiClientModule,
  DisabilityLicenseApiClientConfig,
  DisabilityLicenseClientService,
} from './clients/disabilityLicense'
import {
  DrivingLicenseApiClientModule,
  DrivingLicenseApiClientConfig,
  DrivingLicenseApiClientService,
} from './clients/drivingLicense'
import {
  FirearmLicenseApiClientModule,
  FirearmLicenseApiClientConfig,
  FirearmLicenseApiClientService,
} from './clients/firearmLicense'
import {
  PASS_TEMPLATE_IDS,
  PassTemplateIds,
  CLIENT_FACTORY,
  LicenseId,
  GenericLicenseClient,
} from './license.types'

@Module({
  imports: [
    DisabilityLicenseApiClientModule,
    FirearmLicenseApiClientModule,
    DrivingLicenseApiClientModule,
  ],
  controllers: [LicensesController, UserLicensesController],
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
        drivingConfig: ConfigType<typeof DrivingLicenseApiClientConfig>,
      ) => {
        const ids: PassTemplateIds = {
          firearm: firearmConfig.passTemplateId,
          disability: disabilityConfig.passTemplateId,
          drivers: drivingConfig.passTemplateId,
        }
        return ids
      },
      inject: [
        FirearmLicenseApiClientConfig.KEY,
        DisabilityLicenseApiClientConfig.KEY,
        DrivingLicenseApiClientConfig.KEY,
      ],
    },
    {
      provide: CLIENT_FACTORY,
      useFactory:
        (
          disabilityClient: DisabilityLicenseClientService,
          firearmClient: FirearmLicenseApiClientService,
          drivingClient: DrivingLicenseApiClientService,
        ) =>
        async (type: LicenseId): Promise<GenericLicenseClient | null> => {
          switch (type) {
            case LicenseId.DRIVING_LICENSE:
              return drivingClient
            case LicenseId.DISABILITY_LICENSE:
              return disabilityClient
            case LicenseId.FIREARM_LICENSE:
              return firearmClient
            default:
              return null
          }
        },
      inject: [
        DisabilityLicenseClientService,
        FirearmLicenseApiClientService,
        DrivingLicenseApiClientService,
      ],
    },
    LicenseService,
  ],
})
export class LicenseModule {}
