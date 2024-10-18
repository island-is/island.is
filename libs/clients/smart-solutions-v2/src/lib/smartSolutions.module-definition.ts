import { ConfigurableModuleBuilder } from '@nestjs/common'
import { SmartSolutionsModuleOptions } from './types/config.type'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SmartSolutionsModuleOptions>().build()
