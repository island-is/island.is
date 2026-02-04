import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { EmployeesInput } from './dto/employeesInput'
import { IcelandicGovernmentEmployeesService } from './icelandicGovernmentEmployees.service'
import { EmployeeCollection } from './models/employeeCollection.model'

@Audit({ namespace: '@island.is/api/icelandic-government-employees' })
@Resolver(() => EmployeeCollection)
@BypassAuth()
export class IcelandicGovernmentEmployeesResolver {
  constructor(private readonly service: IcelandicGovernmentEmployeesService) {}

  @Query(() => EmployeeCollection, {
    name: 'icelandicGovernmentEmployees',
    nullable: true,
  })
  @Audit()
  async getEmployees(
    @Args('input') input: EmployeesInput,
  ): Promise<EmployeeCollection> {
    return this.service.getEmployees(
      input.organizationId,
      input.locale,
      input.activeOnly,
    )
  }
}
