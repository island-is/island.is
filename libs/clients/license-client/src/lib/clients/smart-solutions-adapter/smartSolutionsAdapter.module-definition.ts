import { ConfigurableModuleBuilder } from '@nestjs/common'
import { SmartSolutionsAdapterModuleOptions } from './smartSolutionsAdapter.types'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SmartSolutionsAdapterModuleOptions>().build()
