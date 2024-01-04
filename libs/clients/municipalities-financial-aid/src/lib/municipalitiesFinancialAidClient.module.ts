import { Module } from '@nestjs/common'
import { exportedApis } from './apis'
import { MunicipalitiesFinancialAidClientService } from './municipalitiesFinancialAidClient.service'

@Module({
  providers: [MunicipalitiesFinancialAidClientService, ...exportedApis],
  exports: [...exportedApis, MunicipalitiesFinancialAidClientService],
})
export class MunicipalitiesFinancialAidClientModule {}
