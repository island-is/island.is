import { Injectable } from '@nestjs/common'
import { OpenInvoicesApi, OrganizationEmployeeApi } from '../../gen/fetch'
import { EmployeeDto } from './dtos/employee.dto'
import { SearchRequestDto } from './dtos/searchRequest.dto'
import { InvoiceRequestDto } from './dtos/invoiceRequest.dto'
import { isDefined } from '@island.is/shared/utils'
import { SuppliersDto } from './dtos/suppliers.dto'
import { mapSupplierDto } from './dtos/supplier.dto'
import { CustomersDto } from './dtos/customers.dto'
import { mapCustomerDto } from './dtos/customer.dto'
import { InvoiceTypesDto } from './dtos/invoiceTypes.dto'
import { mapInvoiceTypeDto } from './dtos/invoiceType.dto'
import { mapPageInfo } from './utils/pageInfo.util'
import { InvoiceGroupRequestDto } from './dtos/invoiceGroupRequest.dto'
import {
  InvoiceGroupCollectionDto,
  mapInvoiceGroupCollectionDto,
} from './dtos/invoiceGroupCollection.dto'
import { InvoiceGroupDto, mapInvoiceGroupDto } from './dtos/invoiceGroup.dto'

@Injectable()
export class ElfurClientService {
  constructor(
    private readonly employeeApi: OrganizationEmployeeApi,
    private readonly invoicesApi: OpenInvoicesApi,
  ) {}

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

  public async getOpenInvoiceGroups(
    input?: InvoiceGroupRequestDto,
  ): Promise<InvoiceGroupCollectionDto | null> {
    const data = await this.invoicesApi.v1OpeninvoicesInvoicesGet(
      input
        ? {
            dateFrom: input?.dateFrom,
            dateTo: input?.dateTo,
            suppliers: input?.suppliers,
            customers: input?.customers,
            typeIds: input?.types,
          }
        : {},
    )

    return mapInvoiceGroupCollectionDto(data)
  }

  public async getOpenInvoiceGroup(
    requestParams: InvoiceRequestDto,
  ): Promise<InvoiceGroupDto | null> {
    const data =
      await this.invoicesApi.v1OpeninvoicesInvoicesSupplierIdCustomerIdGet({
        supplierId: requestParams.supplier,
        customerId: requestParams.customer,
      })

    return mapInvoiceGroupDto(data)
  }

  public async getSuppliers(
    requestParams?: SearchRequestDto,
  ): Promise<SuppliersDto | null> {
    const {
      suppliers = [],
      pageInfo,
      totalCount,
    } = await this.invoicesApi.v1OpeninvoicesSuppliersGet(requestParams ?? {})

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
    const {
      customersList = [],
      pageInfo,
      totalCount,
    } = await this.invoicesApi.v1OpeninvoicesCustomersGet(requestParams ?? {})

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
    const data = await this.invoicesApi.v1OpeninvoicesTypesGet(
      requestParams ?? {},
    )

    if (
      !data.pageInfo ||
      data.pageInfo.hasNextPage === undefined ||
      !data.totalCount
    ) {
      return null
    }

    return {
      invoiceTypes:
        data.invoiceTypesList?.map(mapInvoiceTypeDto).filter(isDefined) ?? [],
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }
}
