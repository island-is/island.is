import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { EmployeeList } from '../models/employeeList.model'
import { InvoicesInput } from '../dtos/getEmployeeList.input'

@Resolver()
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoicesResolver {
  constructor(private readonly employeeService: InvoicesService) {}

  @Query(() => EmployeeList, {
    name: 'icelandicGovernmentInstitutionsInvoices',
    nullable: true,
  })
  @BypassAuth()
  async getEmployeeList(
    @Args('input', { type: () => InvoicesInput })
    input: InvoicesInput,
  ): Promise<EmployeeList | null> {
    return this.employeeService.getInvoices(input.organizationId)
  }
}
