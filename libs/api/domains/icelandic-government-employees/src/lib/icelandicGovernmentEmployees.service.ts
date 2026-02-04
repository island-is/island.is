import { Inject, Injectable } from '@nestjs/common'
import { FinancialManagementAuthorityClientEmployeesService } from '@island.is/clients/financial-management-authority'
import { Locale } from '@island.is/shared/types'
import { mapEmployee } from './mappers/employeeMapper'
import { isDefined } from '@island.is/shared/utils'
import { EmployeeCollection } from './models/employeeCollection.model'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class IcelandicGovernmentEmployeesService {
  constructor(
    private readonly employeesClient: FinancialManagementAuthorityClientEmployeesService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getEmployees(
    organizationId: string,
    locale: Locale,
    activeOnly: boolean,
  ): Promise<EmployeeCollection> {
    const employees = await this.employeesClient.getOrganizationEmployees(
      organizationId,
      activeOnly,
    )

    return {
      data: employees
        .map((e) => mapEmployee(e))
        .filter(isDefined)
        .sort((a, b) => a.name.localeCompare(b.name, locale)),
      totalCount: employees.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }
}
