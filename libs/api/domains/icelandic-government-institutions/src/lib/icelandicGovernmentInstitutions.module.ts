import { DynamicModule, Module } from '@nestjs/common'
import { ElfurClientModule } from '@island.is/clients/elfur'
import { EmployeesResolver } from './resolvers/employees.resolver'
import { EmployeesService } from './services/employees/employees.service'
import { MockInvoicesService } from './services/invoices/invoices.service.mock'
import { InvoicesService } from './services/invoices/invoices.service'
import { InvoicesResolver } from './resolvers/invoices.resolver'
import { MockEmployeesService } from './services/employees/employees.service.mock'

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
        InvoicesResolver,
      ],
    }
  }
}
