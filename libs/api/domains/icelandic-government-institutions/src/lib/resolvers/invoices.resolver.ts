import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { EmployeeList } from '../models/employeeList.model'
import { IInvoicesService } from '../services/invoices/invoices.service.interface'

@Resolver()
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoicesResolver {
  constructor(private readonly employeeService: IInvoicesService) {}

  @Query(() => EmployeeList, {
    name: 'icelandicGovernmentInstitutionsInvoices',
    nullable: true,
  })
  @BypassAuth()
  async getInvoices(): Promise<EmployeeList | null> {
    return this.employeeService.getInvoices(input.organizationId)
  }
}
