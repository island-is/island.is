import { DynamicModule, Module } from '@nestjs/common'
import { GovernmentInvoicesClientModule } from '@island.is/clients/government-invoices'
import { EmployeesResolver } from './resolvers/employees.resolver'
import { EmployeesService } from './services/employees/employees.service'
import { InvoicesService } from './services/invoices/invoices.service'
import { MockEmployeesService } from './services/employees/employees.service.mock'
import { InvoicePaymentsGroupResolver } from './resolvers/invoicePaymentsGroup.resolver'
import { InvoicePaymentsGroupsResolver } from './resolvers/invoicePaymentsGroups.resolver'

export interface IcelandicGovernmentInstitutionsModuleConfig {
  useMocks: boolean
}

@Module({})
export class IcelandicGovernmentInstitutionsModule {
  static register(
    options: IcelandicGovernmentInstitutionsModuleConfig,
  ): DynamicModule {
    return {
      module: IcelandicGovernmentInstitutionsModule,
      imports: [GovernmentInvoicesClientModule],
      providers: [
        InvoicesService,
        {
          provide: 'IEmployeesService',
          useClass: options.useMocks ? MockEmployeesService : EmployeesService,
        },
        EmployeesResolver,
        InvoicePaymentsGroupResolver,
        InvoicePaymentsGroupsResolver,
      ],
    }
  }
}
