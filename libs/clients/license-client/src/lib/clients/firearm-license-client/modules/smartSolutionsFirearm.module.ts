import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { FirearmDigitalLicenseClientConfig } from '../firearmLicenseClient.config'
import { ConfigType } from '@nestjs/config'
import { SmartSolutionsAdapterModule } from '../../smart-solutions-adapter/smartSolutionsAdapter.module'

export const SmartSolutionsFirearmModule =
  SmartSolutionsAdapterModule.registerAsync({
    useFactory: (
      config: ConfigType<typeof FirearmDigitalLicenseClientConfig>,
    ) => {
      return {
        config,
      }
    },
    inject: [FirearmDigitalLicenseClientConfig.KEY],
  })
