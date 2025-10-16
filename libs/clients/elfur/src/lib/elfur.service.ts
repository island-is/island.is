import { Injectable } from '@nestjs/common'
import {
  EmployeeBasicResponseDto,
  OpenInvoiceDetailPaginatedResponseDto,
  OpenInvoicesApi,
  OrganizationEmployeeApi,
  V1OpeninvoicesInvoicesGetRequest,
} from '../../gen/fetch'

@Injectable()
export class ElfurClientService {
  constructor(
    private readonly employeeApi: OrganizationEmployeeApi,
    private readonly invoicesApi: OpenInvoicesApi,
  ) {}

  public async getOrganizationEmployees(
    organizationId: string,
  ): Promise<Array<EmployeeBasicResponseDto>> {
    return this.employeeApi.v1OrganizationEmployeeGetEmployeesForOrganizationGet(
      {
        organizationNumber: organizationId,
      },
    )
  }

  public async getOpenInvoices(
    requestParams: V1OpeninvoicesInvoicesGetRequest = {},
  ): Promise<OpenInvoiceDetailPaginatedResponseDto> {
    return this.invoicesApi.v1OpeninvoicesInvoicesGet(requestParams)
  }
}
