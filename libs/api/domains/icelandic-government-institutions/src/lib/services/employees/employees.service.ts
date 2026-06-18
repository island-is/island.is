import { Injectable } from '@nestjs/common'
import { Employees } from '../../models/employees.model'
import type { Locale } from '@island.is/shared/types'
import { type IEmployeesService } from './employees.service.interface'

// TODO: employee data requires a separate API endpoint not yet in the OpenAPI spec.
// Returning empty until the endpoint is added to clientConfig.json and codegen re-run.
@Injectable()
export class EmployeesService implements IEmployeesService {
  async getEmployees(
    _organizationId: string,
    _locale: Locale,
  ): Promise<Employees> {
    return {
      data: [],
      totalCount: 0,
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    }
  }
}
