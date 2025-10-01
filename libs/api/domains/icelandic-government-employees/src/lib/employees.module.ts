import { Module } from '@nestjs/common'
import { ElfurClientModule } from '@island.is/clients/elfur'
import { EmployeesService } from './employees.service'

@Module({
  imports: [ElfurClientModule],
  providers: [EmployeesService],
})
export class IcelandicGovernmentEmployeesModule {}
