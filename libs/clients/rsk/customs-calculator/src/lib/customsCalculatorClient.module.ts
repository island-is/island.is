import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { exportedApis } from './apis'
import { CustomsCalculatorApiConfiguration } from './apiConfiguration'
import { CustomsCalculatorClientConfig } from './customsCalculatorClient.config'
import { CustomsCalculatorClientService } from './customsCalculatorClient.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [CustomsCalculatorClientConfig],
    }),
  ],
  providers: [
    CustomsCalculatorApiConfiguration,
    ...exportedApis,
    CustomsCalculatorClientService,
  ],
  exports: [CustomsCalculatorClientService],
})
export class CustomsCalculatorClientModule {}
