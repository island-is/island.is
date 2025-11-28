import { Injectable } from '@nestjs/common'
import {
  getV1OpeninvoicesCustomers,
  getV1OpeninvoicesInvoices,
  getV1OpeninvoicesSuppliers,
  getV1OpeninvoicesTypes,
  getV1OrganizationEmployeeGetEmployeesForOrganization,
} from '../gen/fetch'
import { data } from '@island.is/clients/middlewares'
import { mapCustomerDto } from './dtos/customer.dto'
import { CustomersDto } from './dtos/customers.dto'
import { EmployeeDto } from './dtos/employee.dto'
import { mapInvoiceDto } from './dtos/invoice.dto'
import { InvoiceRequestDto } from './dtos/invoiceRequest.dto'
import { mapInvoiceTypeDto } from './dtos/invoiceType.dto'
import { InvoiceTypesDto } from './dtos/invoiceTypes.dto'
import { OpenInvoicesDto } from './dtos/openInvoices.dto'
import { SearchRequestDto } from './dtos/searchRequest.dto'
import { mapSupplierDto } from './dtos/supplier.dto'
import { SuppliersDto } from './dtos/suppliers.dto'
import { mapPageInfo } from './utils/pageInfo.util'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class ElfurClientService {
  public async getOrganizationEmployees(
    organizationId: string,
  ): Promise<Array<EmployeeDto>> {
    const employees = await data(
      getV1OrganizationEmployeeGetEmployeesForOrganization({
        query: {
          organizationNumber: organizationId,
        },
      }),
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

  public async getOpenInvoices(
    requestParams?: InvoiceRequestDto,
  ): Promise<OpenInvoicesDto | null> {
    const { invoices, pageInfo, totalCount } = await data(
      getV1OpeninvoicesInvoices({
        query: {
          limit: requestParams?.limit ?? undefined,
          after: requestParams?.after ?? undefined,
          before: requestParams?.before ?? undefined,
          dateFrom: requestParams?.dateFrom
            ? requestParams.dateFrom.toDateString()
            : undefined,
          dateTo: requestParams?.dateTo
            ? requestParams.dateTo.toDateString()
            : undefined,
          types: requestParams?.types ?? undefined,
          suppliers: requestParams?.sellers ?? undefined,
          customers: requestParams?.buyers ?? undefined,
        },
      }),
    )

    if (!pageInfo || !pageInfo.hasNextPage === undefined || !totalCount) {
      return null
    }

    return {
      invoices: invoices?.map(mapInvoiceDto).filter(isDefined) ?? [],
      pageInfo: mapPageInfo(pageInfo),
      totalCount,
    }
  }

  public async getSuppliers(
    requestParams?: SearchRequestDto,
  ): Promise<SuppliersDto | null> {
    const { suppliers, pageInfo, totalCount } = await data(
      getV1OpeninvoicesSuppliers({
        query: {
          search: requestParams?.search ?? undefined,
          limit: requestParams?.limit ?? undefined,
          after: requestParams?.after ?? undefined,
          before: requestParams?.before ?? undefined,
        },
      }),
    )

    if (!pageInfo || !pageInfo.hasNextPage === undefined || !totalCount) {
      return null
    }

    return {
      suppliers: suppliers?.map(mapSupplierDto).filter(isDefined) ?? [],
      pageInfo: mapPageInfo(pageInfo),
      totalCount,
    }
  }

  public async getCustomers(
    requestParams?: SearchRequestDto,
  ): Promise<CustomersDto | null> {
    const { customersList, pageInfo, totalCount } = await data(
      getV1OpeninvoicesCustomers({
        query: {
          search: requestParams?.search ?? undefined,
          limit: requestParams?.limit ?? undefined,
          after: requestParams?.after ?? undefined,
          before: requestParams?.before ?? undefined,
        },
      }),
    )

    if (!pageInfo || !pageInfo.hasNextPage === undefined || !totalCount) {
      return null
    }

    return {
      customers: customersList?.map(mapCustomerDto).filter(isDefined) ?? [],
      pageInfo: mapPageInfo(pageInfo),
      totalCount,
    }
  }

  public async getInvoiceTypes(
    requestParams?: SearchRequestDto,
  ): Promise<InvoiceTypesDto | null> {
    const { invoiceTypesList, pageInfo, totalCount } = await data(
      getV1OpeninvoicesTypes({
        query: {
          search: requestParams?.search ?? undefined,
          limit: requestParams?.limit ?? undefined,
          after: requestParams?.after ?? undefined,
          before: requestParams?.before ?? undefined,
        },
      }),
    )

    if (!pageInfo || pageInfo.hasNextPage === undefined || !totalCount) {
      return null
    }

    return {
      invoiceTypes:
        invoiceTypesList?.map(mapInvoiceTypeDto).filter(isDefined) ?? [],
      pageInfo: mapPageInfo(pageInfo),
      totalCount: totalCount,
    }
  }
}
