import { Injectable } from '@nestjs/common'
import {
  EmployeeBasicResponseDto,
  getV1OrganizationByFjarlagalidurConstantEmployees,
} from '../../gen/fetch'

@Injectable()
export class FinancialManagementAuthorityEmployeesClientService {
  public getOrganizationEmployees = async (
    organizationId: string,
    activeOnly = true,
  ): Promise<EmployeeBasicResponseDto[]> => {
    const response =
      await getV1OrganizationByFjarlagalidurConstantEmployees({
        path: { fjarlagalidurConstant: organizationId },
        query: { activeOnly },
      })

    return response.data ?? []
  }
}
