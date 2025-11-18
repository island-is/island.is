import { Employees } from '../../models/employees.model'

export interface IEmployeesService {
  getEmployees(organizationId: string): Promise<Employees>
}
