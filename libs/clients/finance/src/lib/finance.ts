import { Inject } from '@nestjs/common'
import { Base64 } from 'js-base64'
import axios from 'axios'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import {
  FinanceStatus,
  FinanceStatusDetails,
  CustomerChargeType,
  CustomerRecords,
  DocumentTypes,
  BillReceiptTypes,
} from './finance.types'

export const FINANCE_OPTIONS = 'FINANCE_OPTIONS'

export interface FinanceServiceOptions {
  url: string
  username: string
  password: string
  ttl?: number
}

export class FinanceService extends RESTDataSource {
  constructor(
    @Inject(FINANCE_OPTIONS)
    private readonly options: FinanceServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super()
    this.baseURL = `${this.options.url}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.options.username}:${this.options.password}`,
      )}`,
    )
  }

  async getFinanceStatus(nationalID: string): Promise<FinanceStatus | null> {
    const response = await this.get<FinanceStatus | null>(
      // `/customerStatusByOrganization?nationalID=${nationalID}`,
      `/customerStatusByOrganization?nationalID=${process.env.FINANCE_TEST_USER}`,
      {
        cacheOptions: { ttl: 0 /* this.options.ttl ?? 600 */ },
      },
    )
    return response
  }

  async getFinanceStatusDetails(
    nationalID: string,
    OrgID: string,
    chargeTypeID: string,
  ): Promise<FinanceStatusDetails | null> {
    const response = await this.get<FinanceStatusDetails | null>(
      // `/customerStatusByOrganizationDetails?nationalID=${nationalID}&OrgID=${OrgID}&chargeTypeID=${chargeTypeID}`,
      `/customerStatusByOrganizationDetails?nationalID=${process.env.FINANCE_TEST_USER}&OrgID=${OrgID}&chargeTypeID=${chargeTypeID}`,
      {
        cacheOptions: { ttl: 0 /* this.options.ttl ?? 600 */ },
      },
    )
    return response
  }

  async getCustomerChargeType(
    nationalID: string,
  ): Promise<CustomerChargeType | null> {
    const response = await this.get<CustomerChargeType | null>(
      `/customerChargeType?nationalID=${process.env.FINANCE_TEST_USER}`,
      {
        cacheOptions: { ttl: 0 /* this.options.ttl ?? 600 */ },
      },
    )
    return response
  }

  async getCustomerRecords(
    nationalID: string,
    chargeTypeID: string[],
    dayFrom: string,
    dayTo: string,
  ): Promise<CustomerRecords | null> {
    const chargeTypeArray = chargeTypeID.map((item) => `&chargeTypeID=${item}`)
    const chargeTypeString = chargeTypeArray.join('')
    const response = await this.get<CustomerRecords | null>(
      `/customerRecords?nationalID=${process.env.FINANCE_TEST_USER}&dayFrom=${dayFrom}&dayTo=${dayTo}${chargeTypeString}`,
      {
        cacheOptions: { ttl: 0 /* this.options.ttl ?? 600 */ },
      },
    )
    return response
  }

  async getBillReceipts(
    nationalID: string,
    dayFrom: string,
    dayTo: string,
  ): Promise<BillReceiptTypes> {
    const response = await this.get<BillReceiptTypes>(
      `/documentsList/billReceipt?nationalID=${process.env.FINANCE_TEST_USER}&dayFrom=${dayFrom}&dayTo=${dayTo}`,
      {
        cacheOptions: { ttl: 0 /* this.options.ttl ?? 600 */ },
      },
    )
    return response
  }

  async getFinanceDocument(
    nationalID: string,
    documentID: string,
  ): Promise<DocumentTypes> {
    const response = await this.get<DocumentTypes>(
      `/document?nationalID=${process.env.FINANCE_TEST_USER}&documentID=${documentID}`,
      {
        cacheOptions: { ttl: 0 /* this.options.ttl ?? 600 */ },
      },
    )
    return response
  }

  async getExcelDocument(
    sheetHeaders: (string | number)[],
    sheetData: (string | number)[][],
  ): Promise<any> {
    const excelData = {
      headers: sheetHeaders,
      data: sheetData,
    }

    console.log('excelData', excelData)
    try {
      const response = await axios
        .post(`http://localhost:3377/download/v1/xlsx`, excelData) // TODO: Add env var for download service for URL.
        .then((res) => res.data)
      return response
    } catch (e) {
      const errMsg = 'Failed to create xlsx sheet'
      const description = e

      this.logger.error(errMsg, {
        message: description,
      })

      throw new Error(`${errMsg}: ${description}`)
    }
  }
}
