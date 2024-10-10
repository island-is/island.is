import { Module } from '@nestjs/common'

import { MunicipalitiesFinancialAidClientModule } from '@island.is/clients/municipalities-financial-aid'

import { SharedTemplateAPIModule } from '../../shared'
import { FinancialAidService } from './financial-aid.service'

@Module({
  imports: [MunicipalitiesFinancialAidClientModule, SharedTemplateAPIModule],
  providers: [FinancialAidService],
  exports: [FinancialAidService],
})
export class FinancialAidModule {}
