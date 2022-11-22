import { Module } from '@nestjs/common'
import { PowerBiResolver } from './powerbi.resolver'

@Module({
  providers: [PowerBiResolver],
})
export class PowerBiModule {}
