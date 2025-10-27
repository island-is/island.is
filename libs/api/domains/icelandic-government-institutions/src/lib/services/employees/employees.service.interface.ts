import { EmployeeList } from '../../models/employeeList.model'

export interface IEmployeesService {
  getEmployees(organizationId: string): Promise<EmployeeList>
}
