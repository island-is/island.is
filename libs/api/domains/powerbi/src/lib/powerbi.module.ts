import { Module } from '@nestjs/common'
import { PowerBiResolver } from './powerbi.resolver'
import { PowerBiServiceProvider } from './serviceProvider'

@Module({
  providers: [PowerBiServiceProvider, PowerBiResolver],
})
export class PowerBiModule {}
