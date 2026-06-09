import { Injectable } from '@nestjs/common'
import {
  getV1OpeninvoicesInvoices,
  getV1OpeninvoicesInvoicesBySupplierIdByCustomerId,
  getV1OpeninvoicesSuppliers,
  getV1OpeninvoicesCustomers,
  getV1OpeninvoicesPaymenttypes,
  getV1OpeninvoicesTypes,
  getV1OrganizationEmployeeGetEmployeesForOrganization,
} from '../../gen/fetch'
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
import { InvoicePaymentTypesDto } from './dtos/invoicePaymentTypes.dto'
import { mapInvoicePaymentTypeDto } from './dtos/invoicePaymentType.dto'

@Injectable()
export class GovernmentInvoicesClientService {
  public async getOrganizationEmployees(
    organizationId: string,
  ): Promise<Array<EmployeeDto>> {
    const { data: employees = [] } =
      await getV1OrganizationEmployeeGetEmployeesForOrganization({
        query: { organizationNumber: organizationId },
      })

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
    const { data } = await getV1OpeninvoicesInvoices(
      input
        ? {
            query: {
              dateFrom: input.dateFrom,
              dateTo: input.dateTo,
              suppliers: input.suppliers,
              customers: input.customers,
              typeIds: input.types,
            },
          }
        : {},
    )

    if (!data) {
      return null
    }

    return mapInvoiceGroupCollectionDto(data)
  }

  public async getOpenInvoiceGroup(
    requestParams: InvoiceRequestDto,
  ): Promise<InvoiceGroupDto | null> {
    const { data } = await getV1OpeninvoicesInvoicesBySupplierIdByCustomerId({
      path: {
        supplierId: requestParams.supplier,
        customerId: requestParams.customer,
      },
    })

    if (!data) {
      return null
    }

    return mapInvoiceGroupDto(data)
  }

  public async getSuppliers(
    requestParams?: SearchRequestDto,
  ): Promise<SuppliersDto | null> {
    const { data } = await getV1OpeninvoicesSuppliers({
      query: requestParams,
    })

    if (
      !data?.pageInfo ||
      data.pageInfo.hasNextPage === undefined ||
      !data.totalCount
    ) {
      return null
    }

    return {
      suppliers: (data.suppliers ?? []).map(mapSupplierDto).filter(isDefined),
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }

  public async getCustomers(
    requestParams?: SearchRequestDto,
  ): Promise<CustomersDto | null> {
    const { data } = await getV1OpeninvoicesCustomers({
      query: requestParams,
    })

    if (
      !data?.pageInfo ||
      data.pageInfo.hasNextPage === undefined ||
      !data.totalCount
    ) {
      return null
    }

    return {
      customers: (data.customersList ?? [])
        .map(mapCustomerDto)
        .filter(isDefined),
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }

  public async getInvoicePaymentTypes(
    requestParams?: SearchRequestDto,
  ): Promise<InvoicePaymentTypesDto | null> {
    const { data } = await getV1OpeninvoicesPaymenttypes({
      query: requestParams,
    })

    if (
      !data?.pageInfo ||
      data.pageInfo.hasNextPage === undefined ||
      !data.totalCount
    ) {
      return null
    }

    return {
      invoicePaymentTypes: (data.tegundList ?? [])
        .map(mapInvoicePaymentTypeDto)
        .filter(isDefined),
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }

  public async getInvoiceTypes(
    requestParams?: SearchRequestDto,
  ): Promise<InvoiceTypesDto | null> {
    const { data } = await getV1OpeninvoicesTypes({
      query: requestParams,
    })

    if (
      !data?.pageInfo ||
      data.pageInfo.hasNextPage === undefined ||
      !data.totalCount
    ) {
      return null
    }

    return {
      invoiceTypes: (data.invoiceTypesList ?? [])
        .map(mapInvoiceTypeDto)
        .filter(isDefined),
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }
}
