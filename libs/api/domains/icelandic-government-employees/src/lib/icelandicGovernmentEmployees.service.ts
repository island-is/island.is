import { Inject, Injectable } from '@nestjs/common'
import { FinancialManagementAuthorityClientEmployeesService } from '@island.is/clients/financial-management-authority'
import { Locale } from '@island.is/shared/types'
import { mapEmployee } from './mappers/employeeMapper'
import { isDefined } from '@island.is/shared/utils'
import { EmployeeCollection } from './models/employeeCollection.model'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

const category = 'api-domains-icelandic-government-employees'

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
    this.logger.info('FETCHING EMPLOYEES', {
      category,
    })
    const employees = await this.employeesClient.getOrganizationEmployees(
      organizationId,
      activeOnly,
    )

    this.logger.info('EMPLOYEES FETCHED', {
      category,
      organizationId,
      activeOnly,
      employeesCount: employees.length,
    })

    this.logger.info('EMPLOYEES MAPPED', {
      category,
    })
    const mappedEmployees = employees.map((e) => mapEmployee(e))

    this.logger.info('EMPLOYEES FILTERED', {
      category,
    })
    const filteredEmployees = mappedEmployees.filter(isDefined)

    this.logger.info('EMPLOYEES SORTED', {
      category,
    })
    const sortedEmployees = filteredEmployees.sort((a, b) =>
      a.name.localeCompare(b.name, locale),
    )

    this.logger.info('EMPLOYEES COUNTED', {
      category,
    })
    const totalCount = sortedEmployees.length

    this.logger.info('EMPLOYEES PAGE INFO', {
      category,
      totalCount,
      sortedEmployeesCount: sortedEmployees.length,
      filteredEmployeesCount: filteredEmployees.length,
    })
    const pageInfo = {
      hasNextPage: false,
    }

    this.logger.info('EMPLOYEES RETURNED', {
      category,
      employeesCount: employees.length,
      mappedEmployeesCount: mappedEmployees.length,
      filteredEmployeesCount: filteredEmployees.length,
      sortedEmployeesCount: sortedEmployees.length,
      totalCount,
      pageInfo,
    })
    return {
      data: sortedEmployees,
      totalCount: employees.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }
}
