import { Module } from '@nestjs/common'
import { WorkMachinesApiProvider } from './workMachinesApiProvider'
import { MachinesApi } from '../../gen/fetch'

@Module({
  providers: [WorkMachinesApiProvider],
  exports: [MachinesApi],
})
export class WorkMachinesClientModule {}
