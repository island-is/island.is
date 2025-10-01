import { Module } from '@nestjs/common'
import { ElfurClientModule } from '@island.is/clients/elfur'
import { IcelandicGovernmentEmployeesResolver } from './employees.resolver'
import { IcelandicGovernmentEmployeesService } from './employees.service'

@Module({
  imports: [ElfurClientModule],
  providers: [IcelandicGovernmentEmployeesService,IcelandicGovernmentEmployeesResolver],
})
export class IcelandicGovernmentEmployeesModule {}
