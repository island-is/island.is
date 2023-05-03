import { Module } from '@nestjs/common'
import { PowerBiServiceProvider } from './powerbi.service'

@Module({
  controllers: [],
  providers: [PowerBiServiceProvider],
  exports: [],
})
export class PowerBiModule {}
