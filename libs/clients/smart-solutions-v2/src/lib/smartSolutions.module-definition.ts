import { ConfigurableModuleBuilder } from '@nestjs/common'
import { SmartSolutionsModuleOptions } from '..'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SmartSolutionsModuleOptions>().build()
