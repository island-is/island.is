import { Injectable } from '@nestjs/common'
import { OrganizationEmployeeApi } from '../../../gen/fetch'
import { EmployeeDto } from '../dtos'

@Injectable()
export class FinancialManagementAuthorityClientEmployeesService {
  constructor(private readonly employeeApi: OrganizationEmployeeApi) {}

  public async getOrganizationEmployees(
    organizationId: string,
  ): Promise<Array<EmployeeDto>> {
    const employees =
      await this.employeeApi.v1OrganizationEmployeeGetEmployeesForOrganizationGet(
        {
          organizationNumber: organizationId,
        },
      )

    return employees.map((employee) => ({
      employeeName: employee.employeeName ?? undefined,
      jobName: employee.jobName ?? undefined,
      email: employee.email ?? undefined,
      workPhone: employee.workPhone ?? undefined,
      locationAddress: employee.locationAddress ?? undefined,
      locationDescription: employee.locationDescription ?? undefined,
      locationPostalCode: employee.locationPostalCode ?? undefined,
      organizationName: employee.organizationName ?? undefined,
    }))
  }
}
