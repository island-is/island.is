import { Module } from '@nestjs/common'

import { MunicipalitiesFinancialAidClientModule } from '@island.is/clients/municipalities-financial-aid'

import { SharedTemplateAPIModule } from '../../shared'
import { FinancialAidService } from './financial-aid.service'
import { RvkFinancialAidClientModule } from '@island.is/clients/rvk-financial-aid'

@Module({
  imports: [
    MunicipalitiesFinancialAidClientModule,
    RvkFinancialAidClientModule,
    SharedTemplateAPIModule,
  ],
  providers: [FinancialAidService],
  exports: [FinancialAidService],
})
export class FinancialAidModule {}
