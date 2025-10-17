import { DynamicModule, Module } from '@nestjs/common'
import { ElfurClientModule } from '@island.is/clients/elfur'
import { EmployeesResolver } from './resolvers/employees.resolver'
import { EmployeesService } from './services/employees.service'
import { MockInvoicesService } from './services/invoices/invoices.service.mock'
import { InvoicesService } from './services/invoices/invoices.service'
import { InvoicesResolver } from './resolvers/invoices.resolver'

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
        EmployeesService,
        EmployeesResolver,
        InvoicesResolver,
      ],
    }
  }
}
