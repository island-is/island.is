import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { CitizenshipService } from './citizenship.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

import {
  CitizenshipClientModule,
  CitizenshipClientConfig,
} from '@island.is/clients/directorate-of-immigration/citizenship'

export class CitizenshipModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: CitizenshipModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        CitizenshipClientModule,
        NationalRegistryClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [CitizenshipClientConfig],
        }),
      ],
      providers: [CitizenshipService],
      exports: [CitizenshipService],
    }
  }
}
