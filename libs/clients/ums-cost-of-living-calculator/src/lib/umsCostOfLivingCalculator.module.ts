import { Module } from '@nestjs/common'
import { UmsCostOfLivingCalculatorClientService } from './umsCostOfLivingCalculator.service'
import { CostOfLivingCalculatorApi } from './fetch/apis/CostOfLivingCalculatorApi'

@Module({
  providers: [
    UmsCostOfLivingCalculatorClientService,
    CostOfLivingCalculatorApi,
  ],
  exports: [UmsCostOfLivingCalculatorClientService],
})
export class ClientsUmsCostOfLivingCalculatorModule {}
