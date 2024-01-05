import { Inject } from '@nestjs/common'
import isEmpty from 'lodash/isEmpty'
import {
  CustomerChargeType,
  CustomerRecords,
  DocumentsListTypes,
  DocumentTypes,
  FinanceStatus,
  FinanceStatusDetails,
  PaymentScheduleType,
  TapsControlTypes,
  PaymentScheduleDetailType,
  DebtLessCertificateType,
  DebtStatusType,
} from './types'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { Auth } from '@island.is/auth-nest-tools'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { FinanceClientConfig } from './FinanceClientConfig'

export class FinanceClientService {
  baseURL: string
  fetch: EnhancedFetchAPI

  constructor(
    @Inject(FinanceClientConfig.KEY)
    private readonly config: ConfigType<typeof FinanceClientConfig>,
    @Inject(XRoadConfig.KEY)
    private readonly xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(IdsClientConfig.KEY)
    private readonly idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    this.baseURL = `${this.xroadConfig.xRoadBasePath}/r1/${this.config.xRoadServicePath}`
    this.fetch = createEnhancedFetch({
      name: 'FJS-financeIsland',
      organizationSlug: 'fjarsysla-rikisins',
      autoAuth: this.idsClientConfig.isConfigured
        ? {
            mode: 'tokenExchange',
            issuer: this.idsClientConfig.issuer,
            clientId: this.idsClientConfig.clientId,
            clientSecret: this.idsClientConfig.clientSecret,
            scope: this.config.tokenExchangeScope,
          }
        : undefined,
      timeout: this.config.fetchTimeout,
    })
  }

  async get<T>(
    path: string,
    params: Record<string, string> | string[][],
    auth: Auth,
  ) {
    const url = new URL(`${this.baseURL}${path}`)
    url.search = new URLSearchParams(params).toString()
    const response = await this.fetch(url.toString(), {
      auth,
      headers: {
        'X-Road-Client': this.xroadConfig.xRoadClient,
      },
    })
    return (await response.json()) as T
  }

  async getFinanceStatus(
    nationalID: string,
    auth: Auth,
  ): Promise<FinanceStatus | null> {
    return this.get<FinanceStatus | null>(
      `/customerStatusByOrganization`,
      {
        nationalID,
      },
      auth,
    )
  }

  async getFinanceStatusDetails(
    nationalID: string,
    orgID: string,
    chargeTypeID: string,
    auth: Auth,
  ): Promise<FinanceStatusDetails | null> {
    return this.get<FinanceStatusDetails | null>(
      `/customerStatusByOrganizationDetails`,
      { nationalID, orgID, chargeTypeID },
      auth,
    )
  }

  async getCustomerChargeType(
    nationalID: string,
    auth: Auth,
  ): Promise<CustomerChargeType | null> {
    const response = await this.get<CustomerChargeType | null>(
      `/customerChargeType`,
      { nationalID },
      auth,
    )
    if (isEmpty(response)) {
      return null
    }
    return response
  }

  async getCustomerRecords(
    nationalID: string,
    chargeTypeIDs: string[],
    dayFrom: string,
    dayTo: string,
    auth: Auth,
  ): Promise<CustomerRecords | null> {
    return this.get<CustomerRecords | null>(
      `/customerRecords`,
      [
        ['nationalID', nationalID],
        ['dayFrom', dayFrom],
        ['dayTo', dayTo],
        ...chargeTypeIDs.map((chargeTypeID) => ['chargeTypeID', chargeTypeID]),
      ],
      auth,
    )
  }

  async getDocumentsList(
    nationalID: string,
    dateFrom: string,
    dateTo: string,
    listPath: string,
    auth: Auth,
  ): Promise<DocumentsListTypes> {
    return this.get<DocumentsListTypes>(
      `/documentsList/${encodeURIComponent(listPath)}`,
      { nationalID, dateFrom, dateTo },
      auth,
    )
  }

  async getFinanceDocument(
    nationalID: string,
    documentID: string,
    auth: Auth,
  ): Promise<DocumentTypes> {
    return this.get<DocumentTypes>(
      `/document`,
      { nationalID, documentID },
      auth,
    )
  }

  async getAnnualStatusDocument(
    nationalID: string,
    year: string,
    auth: Auth,
  ): Promise<DocumentTypes> {
    return this.get<DocumentTypes>(
      `/annualStatusDocument`,
      { nationalID, year },
      auth,
    )
  }

  async getCustomerTapControl(
    nationalID: string,
    auth: Auth,
  ): Promise<TapsControlTypes | null> {
    return this.get<TapsControlTypes>(
      `/customerTapsControl`,
      { nationalID },
      auth,
    )
  }

  async getPaymentSchedules(
    nationalId: string,
    auth: Auth,
  ): Promise<PaymentScheduleType | null> {
    const res = await this.get<PaymentScheduleType>(
      `/myPaymentSchedules`,
      { nationalId },
      auth,
    )
    return res
  }

  async getPaymentScheduleById(
    nationalId: string,
    scheduleNumber: string,
    auth: Auth,
  ): Promise<PaymentScheduleDetailType | null> {
    const res = await this.get<PaymentScheduleDetailType>(
      `/myDetailedSchedule`,
      { nationalId, scheduleNumber },
      auth,
    )
    return res
  }

  async getDebtStatus(nationalId: string, auth: Auth): Promise<any | null> {
    const res = await this.get<DebtStatusType>(
      `/myDebtStatus`,
      { nationalId },
      auth,
    )
    return res
  }

  async getDebtLessCertificate(
    nationalID: string,
    language: string,
    auth: Auth,
  ): Promise<DebtLessCertificateType | null> {
    const res = await this.get<DebtLessCertificateType | null>(
      `/debtLessCertificate`,
      { nationalID, language },
      auth,
    )
    return res
  }
}
