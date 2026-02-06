import { DynamicModule, Module } from '@nestjs/common'
import { ElfurClientModule } from '@island.is/clients/elfur'
import { EmployeesResolver } from './resolvers/employees.resolver'
import { EmployeesService } from './services/employees/employees.service'
import { MockInvoicesService } from './services/invoices/invoices.service.mock'
import { InvoicesService } from './services/invoices/invoices.service'
import { MockEmployeesService } from './services/employees/employees.service.mock'
import { InvoiceGroupResolver } from './resolvers/invoiceGroup.resolver'
import { InvoiceGroupsResolver } from './resolvers/invoiceGroups.resolver'

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
      imports: [ElfurClientModule],
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
        InvoiceGroupsResolver,
      ],
    }
  }
}
