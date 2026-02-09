import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { EmployeesInput } from './dto/employeesInput'
import { IcelandicGovernmentEmployeesService } from './icelandicGovernmentEmployees.service'
import { EmployeeCollection } from './models/employeeCollection.model'
import { BypassAuth } from '@island.is/auth-nest-tools'

@Audit({ namespace: '@island.is/api/icelandic-government-employees' })
@Resolver(() => EmployeeCollection)
export class IcelandicGovernmentEmployeesResolver {
  constructor(private readonly service: IcelandicGovernmentEmployeesService) {}

  @Query(() => EmployeeCollection, {
    name: 'icelandicGovernmentEmployees',
    nullable: true,
  })
  @Audit()
  @BypassAuth()
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
