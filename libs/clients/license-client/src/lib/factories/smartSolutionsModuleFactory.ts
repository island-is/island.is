import {
  SmartSolutionsConfig,
  SmartSolutionsModule,
} from '@island.is/clients/smart-solutions-v2'
import { ConfigFactory } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'

export const smartSolutionsModuleFactory = (
  configFactory: ConfigFactory<SmartSolutionsConfig>,
) =>
  SmartSolutionsModule.registerAsync({
    useFactory: (config: ConfigType<typeof configFactory>) => {
      const smartConfig: SmartSolutionsConfig = {
        apiKey: config.apiKey,
        apiUrl: config.apiUrl,
        passTemplateId: config.passTemplateId,
      }
      return { config: smartConfig }
    },
    inject: [configFactory.KEY],
  })
