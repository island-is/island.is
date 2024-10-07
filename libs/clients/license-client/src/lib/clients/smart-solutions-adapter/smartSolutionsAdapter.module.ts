import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig as SmartOldConfig,
} from '@island.is/clients/smartsolutions'
import {
  SmartSolutionsModule,
  SmartSolutionsConfig as SmartNewConfig,
} from '@island.is/clients/smart-solutions-v2'
import { ConfigType } from '@nestjs/config'
import { ClientConfigType } from '../../factories/config.types'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './smartSolutionsAdapter.module-definition'
import { SmartSolutionsAdapterModuleOptions } from './smartSolutionsAdapter.types'
import { Module } from '@nestjs/common'
import { SmartSolutionsAdapterService } from './smartSolutionsAdapter.service'

@Module({
  imports: [
    SmartSolutionsModule.registerAsync({
      useFactory: (options: SmartSolutionsAdapterModuleOptions) => {
        return { config: options.config }
      },
      inject: [MODULE_OPTIONS_TOKEN],
    }),
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (options: SmartSolutionsAdapterModuleOptions) => {
        return options.config
      },
      inject: [MODULE_OPTIONS_TOKEN],
    }),
  ],
  providers: [SmartSolutionsAdapterService],
})
export class SmartSolutionsAdapterModule extends ConfigurableModuleClass {}
