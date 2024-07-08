import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { DisabilityLicenseUpdateClient } from '../services/disabilityLicenseUpdateClient.service'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions'
import { DisabilityDigitalLicenseClientConfig } from '../disabilityLicenseClient.config'

@Module({
  imports: [
    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DisabilityDigitalLicenseClientConfig>,
      ) => {
        return {
          config,
        }
      },
      inject: [DisabilityDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [DisabilityLicenseUpdateClient],
  exports: [DisabilityLicenseUpdateClient],
})
export class DisabilityUpdateClientModule {}
