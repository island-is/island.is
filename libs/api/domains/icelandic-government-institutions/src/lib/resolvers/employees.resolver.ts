import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { EmployeeList } from '../models/employeeList.model'
import { EmployeesInput } from '../dtos/getEmployeeList.input'
import { EmployeesService } from '../services/employees/employees.service'
import { Inject } from '@nestjs/common'

@Resolver()
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class EmployeesResolver {
  constructor(
    @Inject('IEmployeesService')
    private readonly employeeService: EmployeesService,
  ) {}

  @Query(() => EmployeeList, {
    name: 'icelandicGovernmentInstitutionsEmployees',
    nullable: true,
  })
  @BypassAuth()
  async getEmployeeList(
    @Args('input', { type: () => EmployeesInput })
    input: EmployeesInput,
  ): Promise<EmployeeList | null> {
    return this.employeeService.getEmployees(input.organizationId)
  }
}
