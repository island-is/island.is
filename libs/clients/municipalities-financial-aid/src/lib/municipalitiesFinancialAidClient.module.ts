import { Module } from '@nestjs/common'
import { exportedApis } from './apis'
import { MunicipalitiesFinancialAidClientService } from './municipalitiesFinancialAidClient.service'

@Module({
  providers: exportedApis,
  exports: exportedApis,
})
export class MunicipalitiesFinancialAidClientModule {}
