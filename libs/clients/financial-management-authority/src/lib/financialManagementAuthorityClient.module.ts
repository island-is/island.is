import { Module } from '@nestjs/common'
import { apiProviders } from './providers'
import { VacancyApi } from '../../gen/fetch'
import { FinancialManagementAuthorityClientEmployeesService as EmployeesService } from './services/employees.service'

@Module({
  providers: [...apiProviders, EmployeesService],
  exports: [VacancyApi, EmployeesService],
})
export class FinancialManagementAuthorityClientModule {}
