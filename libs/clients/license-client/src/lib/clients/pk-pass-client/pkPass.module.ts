import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions-v2'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './pkPass.module-definition'
import { PkPassModuleOptions } from './pkPass.types'
import { Module } from '@nestjs/common'
import { PkPassService } from './pkPass.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    FeatureFlagModule,
    SmartSolutionsModule.registerAsync({
      useFactory: (options: PkPassModuleOptions) => {
        return { config: options.config }
      },
      inject: [MODULE_OPTIONS_TOKEN],
    }),
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (options: PkPassModuleOptions) => {
        return options.config
      },
      inject: [MODULE_OPTIONS_TOKEN],
    }),
  ],
  providers: [PkPassService],
})
export class PkPassModule extends ConfigurableModuleClass {}
