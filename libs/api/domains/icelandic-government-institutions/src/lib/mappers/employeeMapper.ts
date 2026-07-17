import { Employee } from '../models/employee.model'

export interface EmployeeData {
  employeeName?: string
  jobName?: string
  email?: string
  workPhone?: string
  locationAddress?: string
  locationDescription?: string
  locationPostalCode?: string
  organizationName?: string
}

export const mapEmployee = (employee: EmployeeData): Employee | undefined => {
  if (!employee.employeeName) {
    return undefined
  }
  return {
    name: employee.employeeName,
    job: employee.jobName ?? undefined,
    email: employee.email ?? undefined,
    phoneNumber: employee.workPhone ? parseInt(employee.workPhone) : undefined,
    location: employee.locationAddress
      ? {
          address: employee.locationAddress ?? undefined,
          description: employee.locationDescription ?? undefined,
          postalCode: employee.locationPostalCode ?? undefined,
        }
      : undefined,
    department: employee.organizationName ?? undefined,
    currentlyActive: undefined,
  }
}
