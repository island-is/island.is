import { Module } from '@nestjs/common'
import { FinancialManagementAuthorityEmployeesClientModule } from '@island.is/clients/financial-management-authority-employees'
import { IcelandicGovernmentEmployeesResolver } from './icelandicGovernmentEmployees.resolver'
import { IcelandicGovernmentEmployeesService } from './icelandicGovernmentEmployees.service'

@Module({
  imports: [FinancialManagementAuthorityEmployeesClientModule],
  providers: [
    IcelandicGovernmentEmployeesResolver,
    IcelandicGovernmentEmployeesService,
  ],
})
export class IcelandicGovernmentEmployeesModule {}
