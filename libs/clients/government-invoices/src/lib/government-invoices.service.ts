import format from 'date-fns/format'
import { Injectable } from '@nestjs/common'

import { dataOr404Null } from '@island.is/clients/middlewares'
import { isDefined } from '@island.is/shared/utils'

import {
  getV1OpeninvoicesDebtors,
  getV1OpeninvoicesInvoices,
  getV1OpeninvoicesInvoicesBySupplierLegalIdByDebtorGuid,
  getV1OpeninvoicesMinistries,
  getV1OpeninvoicesPaymenttypes,
  getV1OpeninvoicesPaymenttypesGroups,
  getV1OpeninvoicesSuppliers,
} from '../../gen/fetch'
import { mapDebtorDto } from './dtos/debtor.dto'
import { DebtorsDto } from './dtos/debtors.dto'
import {
  InvoicePaymentsGroupDto,
  mapInvoicePaymentsGroupDto,
} from './dtos/invoicePaymentsGroup.dto'
import {
  InvoicePaymentsGroupCollectionDto,
  mapInvoicePaymentsGroupCollectionDto,
} from './dtos/invoicePaymentsGroupCollection.dto'
import { InvoicePaymentsGroupRequestDto } from './dtos/invoicePaymentsGroupRequest.dto'
import { mapInvoicePaymentTypeDto } from './dtos/invoicePaymentType.dto'
import { mapInvoicePaymentTypeGroupDto } from './dtos/invoicePaymentTypeGroup.dto'
import { InvoicePaymentTypeGroupsDto } from './dtos/invoicePaymentTypeGroups.dto'
import { InvoicePaymentTypesDto } from './dtos/invoicePaymentTypes.dto'
import { InvoiceRequestDto } from './dtos/invoiceRequest.dto'
import { MinistriesDto } from './dtos/ministries.dto'
import { mapMinistryDto } from './dtos/ministry.dto'
import { SearchRequestDto } from './dtos/searchRequest.dto'
import { mapSupplierDto } from './dtos/supplier.dto'
import { SuppliersDto } from './dtos/suppliers.dto'
import { dedupeById } from './utils/dedupe.util'
import { groupIdentity } from './utils/groupIdentity.util'
import { mapPageInfo } from './utils/pageInfo.util'

@Injectable()
export class GovernmentInvoicesClientService {
  public async getOpenInvoicePaymentsGroups(
    input: InvoicePaymentsGroupRequestDto,
  ): Promise<InvoicePaymentsGroupCollectionDto | null> {
    const { data } = await getV1OpeninvoicesInvoices({
      query: {
        dateFrom: input.dateFrom
          ? format(input.dateFrom, 'yyyy-MM-dd')
          : undefined,
        dateTo: input.dateTo ? format(input.dateTo, 'yyyy-MM-dd') : undefined,
        suppliers: input.suppliers,
        debtors: input.debtors,
        ministries: input.ministries,
        paymentTypeIds: input.paymentTypeIds,
        sortBy: input.sortBy,
        sortDirection: input.sortDirection,
        limit: input.limit,
        page: input.page,
      },
    })

    if (!data) {
      return null
    }

    return mapInvoicePaymentsGroupCollectionDto(data)
  }

  public async getOpenInvoicePaymentsGroup(
    requestParams: InvoiceRequestDto,
  ): Promise<InvoicePaymentsGroupDto | null> {
    const data = await dataOr404Null(
      getV1OpeninvoicesInvoicesBySupplierLegalIdByDebtorGuid({
        path: {
          supplierLegalId: requestParams.supplierLegalId,
          debtorGuid: requestParams.debtorGuid,
        },
        query: {
          dateFrom: requestParams.dateFrom
            ? format(requestParams.dateFrom, 'yyyy-MM-dd')
            : undefined,
          dateTo: requestParams.dateTo
            ? format(requestParams.dateTo, 'yyyy-MM-dd')
            : undefined,
          paymentTypeIds: requestParams.paymentTypeIds,
          ministries: requestParams.ministries,
        },
      }),
    )

    if (!data) {
      return null
    }

    return mapInvoicePaymentsGroupDto(data)
  }

  public async getSuppliers(
    requestParams: SearchRequestDto,
  ): Promise<SuppliersDto | null> {
    const { data } = await getV1OpeninvoicesSuppliers({
      query: requestParams,
    })

    if (!data?.pageInfo || data.totalCount == null) {
      return null
    }

    return {
      suppliers: dedupeById(
        (data.suppliers ?? []).map(mapSupplierDto).filter(isDefined),
        (supplier) => supplier.legalId,
      ),
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }

  public async getDebtors(
    requestParams: SearchRequestDto,
  ): Promise<DebtorsDto | null> {
    const { data } = await getV1OpeninvoicesDebtors({
      query: requestParams,
    })

    if (!data?.pageInfo || data.totalCount == null) {
      return null
    }

    return {
      debtors: dedupeById(
        (data.debtors ?? []).map(mapDebtorDto).filter(isDefined),
        (debtor) => debtor.debtorGuid,
      ),
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }

  public async getMinistries(
    requestParams: SearchRequestDto,
  ): Promise<MinistriesDto | null> {
    const { data } = await getV1OpeninvoicesMinistries({
      query: requestParams,
    })

    if (!data?.pageInfo || data.totalCount == null) {
      return null
    }

    return {
      ministries: dedupeById(
        (data.ministries ?? []).map(mapMinistryDto).filter(isDefined),
        (ministry) => ministry.code,
      ),
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }

  public async getInvoicePaymentTypes(
    requestParams: SearchRequestDto,
  ): Promise<InvoicePaymentTypesDto | null> {
    const { data } = await getV1OpeninvoicesPaymenttypes({
      query: requestParams,
    })

    if (!data?.pageInfo || data.totalCount == null) {
      return null
    }

    return {
      invoicePaymentTypes: dedupeById(
        (data.paymentTypes ?? [])
          .map(mapInvoicePaymentTypeDto)
          .filter(isDefined),
        (paymentType) => paymentType.code,
      ),
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }

  public async getInvoicePaymentTypeGroups(
    requestParams: SearchRequestDto,
  ): Promise<InvoicePaymentTypeGroupsDto | null> {
    const { data } = await getV1OpeninvoicesPaymenttypesGroups({
      query: requestParams,
    })

    if (!data?.pageInfo || data.totalCount == null) {
      return null
    }

    return {
      invoicePaymentTypeGroups: dedupeById(
        (data.paymentTypeGroups ?? [])
          .map(mapInvoicePaymentTypeGroupDto)
          .filter(isDefined),
        groupIdentity,
      ),
      pageInfo: mapPageInfo(data.pageInfo),
      totalCount: data.totalCount,
    }
  }
}
