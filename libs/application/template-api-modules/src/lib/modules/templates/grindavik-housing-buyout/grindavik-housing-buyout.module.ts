import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { GrindavikHousingBuyoutService } from './grindavik-housing-buyout.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { AssetsClientModule } from '@island.is/clients/assets'

export class GrindavikHousingBuyoutModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: GrindavikHousingBuyoutModule,
      imports: [
        SyslumennClientModule,
        NationalRegistryClientModule,
        AssetsClientModule,
        SharedTemplateAPIModule.register(config),
      ],
      providers: [GrindavikHousingBuyoutService],
      exports: [GrindavikHousingBuyoutService],
    }
  }
}
