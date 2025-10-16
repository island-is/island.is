import { Module } from '@nestjs/common'
import { ElfurClientModule } from '@island.is/clients/elfur'
import { EmployeesResolver } from './resolvers/employees.resolver'
import { EmployeesService } from './services/employees.service'

@Module({
  imports: [ElfurClientModule],
  providers: [
    EmployeesService,
    EmployeesResolver,
  ],
})
export class IcelandicGovernmentInstitutionsModule {}
