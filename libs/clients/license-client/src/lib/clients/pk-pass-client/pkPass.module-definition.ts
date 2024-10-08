import { ConfigurableModuleBuilder } from '@nestjs/common'
import { PkPassModuleOptions } from './pkPass.types'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<PkPassModuleOptions>().build()
