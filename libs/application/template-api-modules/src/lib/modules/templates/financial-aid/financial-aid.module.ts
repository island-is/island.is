import { Module } from '@nestjs/common'

import { MunicipalitiesFinancialAidClientModule } from '@island.is/clients/municipalities-financial-aid'
import { PersonalTaxReturnModule as RskPersonalTaxReturnClientModule } from '@island.is/clients/rsk/personal-tax-return'

import { SharedTemplateAPIModule } from '../../shared'
import { FinancialAidService } from './financial-aid.service'
import { RvkFinancialAidClientModule } from '@island.is/clients/rvk-financial-aid'

@Module({
  imports: [
    MunicipalitiesFinancialAidClientModule,
    RvkFinancialAidClientModule,
    RskPersonalTaxReturnClientModule,
    SharedTemplateAPIModule,
  ],
  providers: [FinancialAidService],
  exports: [FinancialAidService],
})
export class FinancialAidModule {}
