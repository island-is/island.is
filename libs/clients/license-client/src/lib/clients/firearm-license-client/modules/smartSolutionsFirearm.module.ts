import { SmartSolutionsModule } from '@island.is/clients/smart-solutions'
import { ConfigType } from '@nestjs/config'
import { FirearmDigitalLicenseClientConfig } from '../firearmLicenseClient.config'

export const SmartSolutionsFirearmModule = SmartSolutionsModule.registerAsync({
  useFactory: (
    config: ConfigType<typeof FirearmDigitalLicenseClientConfig>,
  ) => {
    return {
      config,
    }
  },
  inject: [FirearmDigitalLicenseClientConfig.KEY],
})
