import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { GrindavikHousingBuyoutService } from './grindavik-housing-buyout.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { NationalRegistryV3ApplicationsClientModule } from '@island.is/clients/national-registry-v3-applications'
import { AssetsClientModule } from '@island.is/clients/assets'

@Module({
  imports: [
    SyslumennClientModule,
    NationalRegistryV3ApplicationsClientModule,
    AssetsClientModule,
    SharedTemplateAPIModule,
  ],
  providers: [GrindavikHousingBuyoutService],
  exports: [GrindavikHousingBuyoutService],
})
export class GrindavikHousingBuyoutModule {}
