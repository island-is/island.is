import { Module } from '@nestjs/common'
import { MunicipalitiesFinancialAidResolver } from './municipalitiesFinancialAid.resolver'
import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import { ApplicationApiProvider } from './applicationApiProvider'

@Module({
  providers: [
    MunicipalitiesFinancialAidResolver,
    MunicipalitiesFinancialAidService,
    ApplicationApiProvider,
  ],
})
export class MunicipalitiesFinancialAidModule {}
