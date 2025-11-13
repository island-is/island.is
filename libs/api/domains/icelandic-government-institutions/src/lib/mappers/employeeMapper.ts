import { EmployeeDto } from '@island.is/clients/elfur'
import { Employee } from '../models/employee.model'

export const mapEmployee = (employee: EmployeeDto): Employee | undefined => {
  if (!employee.employeeName) {
    return undefined
  }
  return {
    name: employee.employeeName,
    job: employee.jobName ?? undefined,
    email: employee.email ?? undefined,
    phoneNumber: employee.workPhone ?? undefined,
    location: employee.locationAddress
      ? {
          address: employee.locationAddress ?? undefined,
          description: employee.locationDescription ?? undefined,
          postalCode: employee.locationPostalCode ?? undefined,
        }
      : undefined,
    department: employee.organizationName ?? undefined,
    currentlyActive: undefined, //not sure what this should be
  }
}
