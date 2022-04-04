import { Module } from '@nestjs/common'
import { exportedApis } from './apis'
import { MunicipalitiesFinancialAidConfig } from './municipalitiesFinancialAid.config'

@Module({
  imports: [MunicipalitiesFinancialAidConfig.registerOptional()],
  providers: exportedApis,
  exports: exportedApis,
})
export class MunicipalitiesFinancialAidClientModule {}
