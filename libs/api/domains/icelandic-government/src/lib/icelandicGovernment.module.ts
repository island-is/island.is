import { DynamicModule, Module } from '@nestjs/common'
import { FinancialManagementAuthorityClientModule } from '@island.is/clients/financial-management-authority'
import { EmployeesResolver } from './resolvers/employees.resolver'
import { EmployeesService } from './services/employees/employees.service'
import { MockInvoicesService } from './services/invoices/invoices.service.mock'
import { InvoicesService } from './services/invoices/invoices.service'
import { MockEmployeesService } from './services/employees/employees.service.mock'
import { InvoiceGroupResolver } from './resolvers/invoiceGroup.resolver'

export interface IcelandicGovernmentModuleConfig {
  useMocks: boolean
}

@Module({})
export class IcelandicGovernmentModule {
  static register(options: IcelandicGovernmentModuleConfig): DynamicModule {
    return {
      module: IcelandicGovernmentModule,
      imports: [FinancialManagementAuthorityClientModule],
      providers: [
        {
          provide: 'IInvoicesService',
          useClass: options.useMocks ? MockInvoicesService : InvoicesService,
        },
        {
          provide: 'IEmployeesService',
          useClass: options.useMocks ? MockEmployeesService : EmployeesService,
        },
        EmployeesResolver,
        InvoiceGroupResolver,
      ],
    }
  }
}
