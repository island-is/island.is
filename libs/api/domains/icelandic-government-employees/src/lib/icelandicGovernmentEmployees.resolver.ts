import { Args, Query, Resolver } from '@nestjs/graphql'
import { EmployeesInput } from './dto/employeesInput'
import { IcelandicGovernmentEmployeesService } from './icelandicGovernmentEmployees.service'
import { EmployeeCollection } from './models/employeeCollection.model'

@Resolver(() => EmployeeCollection)
export class IcelandicGovernmentEmployeesResolver {
  constructor(private readonly service: IcelandicGovernmentEmployeesService) {}

  @Query(() => EmployeeCollection, {
    name: 'icelandicGovernmentEmployees',
    nullable: true,
  })
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
