import { Injectable } from '@nestjs/common'
import {
  EmployeeBasicResponseDto,
  OpenInvoiceDetailPaginatedResponseDto,
  OpenInvoicesApi,
  OrganizationEmployeeApi,
  V1OpeninvoicesInvoicesGetRequest,
} from '../../gen/fetch'
import { OpenInvoicesDto } from './dtos/openInvoices.dto'
import { isDefined} from '@island.is/shared/utils'

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
  ): Promise<OpenInvoicesDto | null> {
    const {invoices = [], pageInfo, totalCount} = await this.invoicesApi.v1OpeninvoicesInvoicesGet(requestParams)

    if (!pageInfo || !pageInfo.hasNextPage || !totalCount) {
      return null
    }

    return {
      invoices: (invoices?.map(invoice => {
        if (!invoice.invoiceSK || !invoice.invoiceNum) {
          return null
        }
        return {
          cacheId: invoice.invoiceSK,
          id: invoice.invoiceNum
        }
      }).filter(isDefined)) ?? [],
      pageInfo: {
        hasPreviousPage: pageInfo.hasPreviousPage ?? undefined,
        hasNextPage: pageInfo.hasNextPage,
        startCursor: pageInfo.startCursor ?? undefined,
        endCursor: pageInfo.endCursor ?? undefined,
      },
      totalCount,
    }
  }
}
