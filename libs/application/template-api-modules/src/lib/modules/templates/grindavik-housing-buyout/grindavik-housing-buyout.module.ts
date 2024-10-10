import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { GrindavikHousingBuyoutService } from './grindavik-housing-buyout.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { AssetsClientModule } from '@island.is/clients/assets'

@Module({
  imports: [
    SyslumennClientModule,
    NationalRegistryClientModule,
    AssetsClientModule,
    SharedTemplateAPIModule,
  ],
  providers: [GrindavikHousingBuyoutService],
  exports: [GrindavikHousingBuyoutService],
})
export class GrindavikHousingBuyoutModule {}
