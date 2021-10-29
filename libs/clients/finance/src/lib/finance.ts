import { Inject } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import type { Logger } from '@island.is/logging'
import isEmpty from 'lodash/isEmpty'
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
  AnnualStatusTypes,
} from './finance.types'

export const FINANCE_OPTIONS = 'FINANCE_OPTIONS'

export interface FinanceServiceOptions {
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
  }

  handleError(error: string, exception: Error): any {
    this.logger.error(error, {
      exception,
    })
    throw new ApolloError('Failed to resolve request', error)
  }

  async getFinanceStatus(
    nationalID: string,
    authToken: string,
  ): Promise<FinanceStatus | null> {
    let response
    try {
      response = await this.get<FinanceStatus | null>(
        `/customerStatusByOrganization?nationalID=${nationalID}`,
        {},
        {
          cacheOptions: { ttl: this.options.ttl },
          headers: {
            Authorization: authToken,
          },
        },
      )
    } catch (e) {
      return this.handleError('Failed to get finance status', e)
    }
    return response
  }

  async getFinanceStatusDetails(
    nationalID: string,
    OrgID: string,
    chargeTypeID: string,
    authToken: string,
  ): Promise<FinanceStatusDetails | null> {
    let response
    try {
      response = await this.get<FinanceStatusDetails | null>(
        `/customerStatusByOrganizationDetails?nationalID=${nationalID}&orgID=${OrgID}&chargeTypeID=${chargeTypeID}`,
        {},
        {
          cacheOptions: { ttl: this.options.ttl },
          headers: {
            Authorization: authToken,
          },
        },
      )
    } catch (e) {
      return this.handleError('Failed to get finance status details', e)
    }
    return response
  }

  async getCustomerChargeType(
    nationalID: string,
    authToken: string,
  ): Promise<CustomerChargeType | null> {
    let response
    try {
      response = await this.get<CustomerChargeType | null>(
        `/customerChargeType?nationalID=${nationalID}`,
        {},
        {
          cacheOptions: { ttl: this.options.ttl },
          headers: {
            Authorization: authToken,
          },
        },
      )
      if (isEmpty(response)) {
        response = null
      }
    } catch (e) {
      return this.handleError('Failed to get customer charge type', e)
    }
    return response
  }

  async getCustomerRecords(
    nationalID: string,
    chargeTypeID: string[],
    dayFrom: string,
    dayTo: string,
    authToken: string,
  ): Promise<CustomerRecords | null> {
    const chargeTypeArray = chargeTypeID.map((item) => `&chargeTypeID=${item}`)
    const chargeTypeString = chargeTypeArray.join('')
    let response
    try {
      response = await this.get<CustomerRecords | null>(
        `/customerRecords?nationalID=${nationalID}&dayFrom=${dayFrom}&dayTo=${dayTo}${chargeTypeString}`,
        {},
        {
          cacheOptions: { ttl: this.options.ttl },
          headers: {
            Authorization: authToken,
          },
        },
      )
    } catch (e) {
      return this.handleError('Failed to get customer records', e)
    }
    return response
  }

  async getDocumentsList(
    nationalID: string,
    dayFrom: string,
    dayTo: string,
    listPath: string,
    authToken: string,
  ): Promise<DocumentsListTypes> {
    let response
    try {
      response = await this.get<DocumentsListTypes>(
        `/documentsList/${listPath}?nationalID=${nationalID}&dateFrom=${dayFrom}&dateTo=${dayTo}`,
        {},
        {
          cacheOptions: { ttl: this.options.ttl },
          headers: {
            Authorization: authToken,
          },
        },
      )
    } catch (e) {
      return this.handleError('Failed to get finance document list', e)
    }
    return response
  }

  async getFinanceDocument(
    nationalID: string,
    documentID: string,
    authToken: string,
  ): Promise<DocumentTypes> {
    let response
    try {
      response = await this.get<DocumentTypes>(
        `/document?nationalID=${nationalID}&documentID=${documentID}`,
        {},
        {
          cacheOptions: { ttl: this.options.ttl },
          headers: {
            Authorization: authToken,
          },
        },
      )
    } catch (e) {
      return this.handleError('Failed to get finance document', e)
    }
    return response
  }

  async getAnnualStatusDocument(
    nationalID: string,
    year: string,
    authToken: string,
  ): Promise<AnnualStatusTypes> {
    let response
    try {
      response = await this.get<AnnualStatusTypes>(
        `/annualStatusDocument?nationalID=${nationalID}&year=${year}`,
        {},
        {
          cacheOptions: { ttl: this.options.ttl },
          headers: {
            Authorization: authToken,
          },
        },
      )
    } catch (e) {
      return this.handleError('Failed to get finance annual status document', e)
    }
    return response
  }

  async getCustomerTapControl(
    nationalID: string,
    authToken: string,
  ): Promise<TapsControlTypes | null> {
    let response
    try {
      response = await this.get<TapsControlTypes>(
        `/customerTapsControl?nationalID=${nationalID}`,
        {},
        {
          cacheOptions: { ttl: this.options.ttl },
          headers: {
            Authorization: authToken,
          },
        },
      )
    } catch (e) {
      return this.handleError('Failed to get customer tabs', e)
    }
    return response
  }
}
