import { Module } from '@nestjs/common'
import { AdrApiProvider } from './providers/adrProvider'
import { MachineApiProvider } from './providers/machineProvider'

@Module({
  providers: [MachineApiProvider, AdrApiProvider],
  exports: [MachineApiProvider, AdrApiProvider],
})
export class AoshClientModule {}
