import { Module } from '@nestjs/common'
import { MunicipalitiesFinancialAidClientModule } from '@island.is/clients/municipalities-financial-aid'
import { MunicipalitiesFinancialAidResolver } from './municipalitiesFinancialAid.resolver'
import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'

@Module({
  providers: [
    MunicipalitiesFinancialAidResolver,
    MunicipalitiesFinancialAidService,
  ],
  imports: [MunicipalitiesFinancialAidClientModule],
})
export class MunicipalitiesFinancialAidModule {}
