import { Injectable } from '@nestjs/common'
import { Employees } from '../../models/employees.model'
import { mapEmployee } from '../../mappers/employeeMapper'
import { isDefined } from '@island.is/shared/utils'
import type { Locale } from '@island.is/shared/types'
import { type IEmployeesService } from './employees.service.interface'
import { FinancialManagementAuthorityClientEmployeesService } from '@island.is/clients/financial-management-authority'

@Injectable()
export class EmployeesService implements IEmployeesService {
  constructor(
    private service: FinancialManagementAuthorityClientEmployeesService,
  ) {}

  async getEmployees(
    organizationId: string,
    locale: Locale,
  ): Promise<Employees> {
    const data = await this.service.getOrganizationEmployees(organizationId)

    return {
      data: data
        .map((e) => mapEmployee(e))
        .filter(isDefined)
        .sort((a, b) => a.name.localeCompare(b.name, locale)),
      totalCount: data.length,
      //until better
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }
}
