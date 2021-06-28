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
  DocumentsListTypes,
  TapsControlTypes,
} from './finance.types'

export const FINANCE_OPTIONS = 'FINANCE_OPTIONS'

export interface FinanceServiceOptions {
  username: string
  password: string
  xroadApiPath: string
  xroadBaseUrl: string
  xroadClientId: string
  downloadServiceBaseUrl: string
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
    this.baseURL = `${this.options.xroadBaseUrl}/r1/${this.options.xroadApiPath}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('X-Road-Client', this.options.xroadClientId)
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.options.username}:${this.options.password}`,
      )}`,
    )
  }

  async getFinanceStatus(nationalID: string): Promise<FinanceStatus | null> {
    const response = await this.get<FinanceStatus | null>(
      `/customerStatusByOrganization?nationalID=${nationalID}`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
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
      `/customerStatusByOrganizationDetails?nationalID=${nationalID}&OrgID=${OrgID}&chargeTypeID=${chargeTypeID}`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
      },
    )
    return response
  }

  async getCustomerChargeType(
    nationalID: string,
  ): Promise<CustomerChargeType | null> {
    const response = await this.get<CustomerChargeType | null>(
      `/customerChargeType?nationalID=${nationalID}`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
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
      `/customerRecords?nationalID=${nationalID}&dayFrom=${dayFrom}&dayTo=${dayTo}${chargeTypeString}`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
      },
    )
    return response
  }

  async getDocumentsList(
    nationalID: string,
    dayFrom: string,
    dayTo: string,
    listPath: string,
  ): Promise<DocumentsListTypes> {
    const response = await this.get<DocumentsListTypes>(
      `/documentsList/${listPath}?nationalID=${nationalID}&dateFrom=${dayFrom}&dateTo=${dayTo}`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
      },
    )
    return response
  }

  async getFinanceDocument(
    nationalID: string,
    documentID: string,
  ): Promise<DocumentTypes> {
    const response = await this.get<DocumentTypes>(
      `/document?nationalID=${nationalID}&documentID=${documentID}`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
      },
    )
    return response
  }

  async getCustomerTapControl(nationalID: string): Promise<TapsControlTypes> {
    const response = await this.get<TapsControlTypes>(
      `/customerTapsControl?nationalID=${nationalID}`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
      },
    )
    return response
  }

  async getExcelDocument(
    sheetHeaders: (string | number)[],
    sheetData: (string | number)[][],
    token: string,
  ): Promise<any> {
    const excelData = {
      headers: sheetHeaders,
      data: sheetData,
      __accessToken: token,
    }

    try {
      const response = await axios
        .post(
          `${this.options.downloadServiceBaseUrl}/download/v1/xlsx`,
          excelData,
        )
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
