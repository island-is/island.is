import { Injectable } from '@nestjs/common'
import {
  EmployeeBasicResponseDto,
  OrganizationEmployeeApi,
} from '../../gen/fetch'

@Injectable()
export class ElfurClientService {
  constructor(private readonly api: OrganizationEmployeeApi) {}

  public async getOrganizationEmployees(
    organizationId: string,
  ): Promise<Array<EmployeeBasicResponseDto>> {
    return this.api.v1OrganizationEmployeeGetEmployeesForOrganizationGet({
      organizationNumber: organizationId,
    })
  }
}
