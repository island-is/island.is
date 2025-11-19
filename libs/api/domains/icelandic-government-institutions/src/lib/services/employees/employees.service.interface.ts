import type { Locale } from '@island.is/shared/types'
import { Employees } from '../../models/employees.model'

export interface IEmployeesService {
  getEmployees(organizationId: string, locale: Locale): Promise<Employees>
}
