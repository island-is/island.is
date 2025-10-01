import { IdsUserGuard, CurrentUser, type User } from "@island.is/auth-nest-tools"
import { UseGuards, } from "@nestjs/common"
import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from "@nestjs/graphql"
import { IcelandicGovernmentEmployeesService } from "./employees.service"
import { EmployeeList } from "./models/employeeList.model"
import { EmployeesInput } from "./dtos/getEmployeeList.input"

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/icelandic-government-employees' })
export class IcelandicGovernmentEmployeesResolver {
  constructor(
    private readonly employeeService: IcelandicGovernmentEmployeesService,
  ) {}

  @Query(() => EmployeeList, {
    name: 'icelandicGovernmentEmployees',
    nullable: true,
  })
  @Audit()
  async getEmployeeList(
    @CurrentUser() user: User,
    @Args('input', { type: () => EmployeesInput })
    input: EmployeesInput,
  ): Promise<EmployeeList | null> {
    return this.employeeService.getEmployees(user, input.organizationId)
  }
