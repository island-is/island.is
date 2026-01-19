import { Module } from '@nestjs/common'
import { apiProviders } from './providers'
import { VacancyApi } from '../../gen/fetch'
import { FinancialManagementAuthorityClientOpenInvoicesService as OpenInvoicesService } from './services/openInvoices.service'
import { FinancialManagementAuthorityClientEmployeesService as EmployeesService } from './services/employees.service'

@Module({
  providers: [...apiProviders, OpenInvoicesService, EmployeesService],
  exports: [VacancyApi, OpenInvoicesService, EmployeesService],
})
export class FinancialManagementAuthorityClientModule {}
