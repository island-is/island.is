import { Employees } from '../../models/employees.model'
import { EmployeesInput } from '../../dtos/getEmployees.input'

export interface IEmployeesService {
  getEmployees(input: EmployeesInput): Promise<Employees>
}
