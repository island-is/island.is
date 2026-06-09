import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { Employees } from '../models/employees.model'
import { IcelandicGovernmentInstitutionsEmployeesInput } from '../dtos/getEmployees.input'
import { EmployeesService } from '../services/employees/employees.service'
import { Inject } from '@nestjs/common'

@Resolver()
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class EmployeesResolver {
  constructor(
    @Inject('IEmployeesService')
    private readonly employeeService: EmployeesService,
  ) {}

  @Query(() => Employees, {
    name: 'icelandicGovernmentInstitutionsEmployees',
    nullable: true,
  })
  @BypassAuth()
  async getEmployeeList(
    @Args() input: IcelandicGovernmentInstitutionsEmployeesInput,
  ): Promise<Employees | null> {
    return this.employeeService.getEmployees(input.organizationId, input.locale)
  }
}
