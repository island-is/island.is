import { Module } from '@nestjs/common'
import { MunicipalitiesFinancialAidResolver } from './municipalitiesFinancialAid.resolver'
import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'
import { ApplicationApiProvider } from '@island.is/clients/municipalities-financial-aid'

@Module({
  providers: [
    MunicipalitiesFinancialAidResolver,
    MunicipalitiesFinancialAidService,
    ApplicationApiProvider,
  ],
})
export class MunicipalitiesFinancialAidModule {}
