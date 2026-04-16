import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { exportedApis } from './apis'
import { CustomsCalculatorApiConfiguration } from './apiConfiguration'
import { CustomsCalculatorClientConfig } from './customsCalculatorClient.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [CustomsCalculatorClientConfig],
    }),
  ],
  providers: [CustomsCalculatorApiConfiguration, ...exportedApis],
  exports: exportedApis,
})
export class CustomsCalculatorClientModule {}
