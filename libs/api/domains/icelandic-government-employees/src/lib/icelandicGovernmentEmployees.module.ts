import { Module } from '@nestjs/common'
import { FinancialManagementAuthorityClientModule } from '@island.is/clients/financial-management-authority'
import { IcelandicGovernmentEmployeesResolver } from './icelandicGovernmentEmployees.resolver'
import { IcelandicGovernmentEmployeesService } from './icelandicGovernmentEmployees.service'

@Module({
  imports: [FinancialManagementAuthorityClientModule],
  providers: [
    IcelandicGovernmentEmployeesResolver,
    IcelandicGovernmentEmployeesService,
  ],
})
export class IcelandicGovernmentEmployeesModule {}
