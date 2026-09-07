import { Module } from '@nestjs/common'
import { CustomsCalculatorApiConfig } from './customsCalculator.apiConfig'
import { CustomsCalculatorClientService } from './customsCalculatorClient.service'
import { CustomsCalculatorClientConfig } from './customsCalculatorClient.config'

@Module({
  imports: [CustomsCalculatorClientConfig.registerOptional()],
  providers: [CustomsCalculatorApiConfig, CustomsCalculatorClientService],
  exports: [CustomsCalculatorClientService],
})
export class CustomsCalculatorClientModule {}
