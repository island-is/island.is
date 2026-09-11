import { Injectable } from '@nestjs/common'
import { Employees } from '../../models/employees.model'
import { type IEmployeesService } from './employees.service.interface'
import { EmployeesInput } from '../../dtos/getEmployees.input'

// TODO: employee data requires a separate API endpoint not yet in the OpenAPI spec.
// Returning empty until the endpoint is added to clientConfig.json and codegen re-run.
@Injectable()
export class EmployeesService implements IEmployeesService {
  async getEmployees(input: EmployeesInput): Promise<Employees> {
    return {
      data: [],
      totalCount: 0,
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    }
  }
}
