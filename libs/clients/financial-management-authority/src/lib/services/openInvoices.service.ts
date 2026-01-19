import { Injectable } from '@nestjs/common'
import { OpenInvoicesApi } from '../../../gen/fetch'
import {
  InvoiceRequestDto,
  SearchRequestDto,
  SuppliersDto,
  mapSupplierDto,
  CustomersDto,
  mapCustomerDto,
  InvoiceTypesDto,
  mapInvoiceTypeDto,
  InvoiceGroupWithInvoicesDto,
  mapInvoiceGroupWithInvoicesDto,
} from '../dtos'
import { mapPageInfo } from '../utils/pageInfo.util'
import { isDefined } from '@island.is/shared/utils'
import {
  InvoiceGroupCollectionDto,
  mapInvoiceGroupCollectionDto,
} from '../dtos/invoiceGroupCollection.dto'
import { InvoiceGroupRequestDto } from '../dtos/invoiceGroupRequest.dto'

@Injectable()
export class FinancialManagementAuthorityClientOpenInvoicesService {
  constructor(private readonly invoicesApi: OpenInvoicesApi) {}

  public async getOpenInvoicesGroups(
    requestParams?: InvoiceGroupRequestDto,
  ): Promise<InvoiceGroupCollectionDto | null> {
    const data = await this.invoicesApi.v1OpeninvoicesInvoicegroupsGet(
      requestParams ?? {},
    )

    return mapInvoiceGroupCollectionDto(data)
  }

  public async getOpenInvoicesGroupWithInvoices(
    requestParams: InvoiceRequestDto,
  ): Promise<InvoiceGroupWithInvoicesDto | null> {
    const data =
      await this.invoicesApi.v1OpeninvoicesInvoicegroupwithinvoicesGet({
        dateFrom: requestParams?.dateFrom,
        dateTo: requestParams?.dateTo,
        types: requestParams?.types,
        supplierId: requestParams.supplier,
        customerId: requestParams.customer,
      })

    return mapInvoiceGroupWithInvoicesDto(data)
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
