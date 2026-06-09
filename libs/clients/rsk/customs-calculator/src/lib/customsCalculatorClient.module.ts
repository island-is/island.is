import { Module } from '@nestjs/common'
import { CustomsCalculatorApiConfig } from './customsCalculator.apiConfig'
import { CustomsCalculatorClientService } from './customsCalculatorClient.service'

@Module({
  providers: [CustomsCalculatorApiConfig, CustomsCalculatorClientService],
  exports: [CustomsCalculatorClientService],
})
export class CustomsCalculatorClientModule {}
