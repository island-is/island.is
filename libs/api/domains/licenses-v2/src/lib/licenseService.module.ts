import { Module } from '@nestjs/common'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { CmsModule } from '@island.is/cms'
import { LicenseClientModule } from '@island.is/clients/license-client'

@Module({
  imports: [LicenseClientModule, CmsModule],
  providers: [
    MainResolver,
    LicenseServiceService,
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: LICENSE_MAPPER_FACTORY,
      useFactory:
        (
          adr: AdrLicensePayloadMapper,
          disability: DisabilityLicensePayloadMapper,
          machine: MachineLicensePayloadMapper,
          firearm: FirearmLicensePayloadMapper,
          driving: DrivingLicensePayloadMapper,
          pCard: PCardPayloadMapper,
          ehic: EHICCardPayloadMapper,
        ) =>
        async (
          type: GenericLicenseType,
        ): Promise<GenericLicenseMapper | null> => {
          switch (type) {
            case GenericLicenseType.AdrLicense:
              return adr
            case GenericLicenseType.DisabilityLicense:
              return disability
            case GenericLicenseType.MachineLicense:
              return machine
            case GenericLicenseType.FirearmLicense:
              return firearm
            case GenericLicenseType.DriversLicense:
              return driving
            case GenericLicenseType.PCard:
              return pCard
            case GenericLicenseType.Ehic:
              return ehic
            default:
              return null
          }
        },
      inject: [
        AdrLicensePayloadMapper,
        DisabilityLicensePayloadMapper,
        MachineLicensePayloadMapper,
        FirearmLicensePayloadMapper,
        DrivingLicensePayloadMapper,
        PCardPayloadMapper,
        EHICCardPayloadMapper,
      ],
    },
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
