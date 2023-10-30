import { Inject } from '@nestjs/common'
import {
  FinanceAssessmentYears,
  FinanceChargeTypeDetails,
  FinanceChargeTypesByYear,
  FinanceRecordsByChargeTypePeriodSubject,
  FinanceChargeItemSubjectsByYear,
} from './types'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { Auth } from '@island.is/auth-nest-tools'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { FinanceClientV2Config } from './FinanceClientV2Config'

export class FinanceClientV2Service {
  baseURL: string
  fetch: EnhancedFetchAPI

  constructor(
    @Inject(FinanceClientV2Config.KEY)
    private readonly config: ConfigType<typeof FinanceClientV2Config>,
    @Inject(XRoadConfig.KEY)
    private readonly xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(IdsClientConfig.KEY)
    private readonly idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    this.baseURL = `${this.xroadConfig.xRoadBasePath}/r1/${this.config.xRoadServicePath}`
    this.fetch = createEnhancedFetch({
      name: 'FJS-financeIsland_V2',
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

  async getAssessmentYears(
    nationalID: string,
    auth: Auth,
  ): Promise<FinanceAssessmentYears['ResultYears'] | null> {
    const result = await this.get<FinanceAssessmentYears | null>(
      `/assessmentYears/${nationalID}`,
      {},
      auth,
    )

    return result?.ResultYears ?? null
  }

  async getChargeTypesByYear(
    nationalID: string,
    year: string,
    auth: Auth,
  ): Promise<FinanceChargeTypesByYear['resultChargeTypesYear'] | null> {
    const result = await this.get<FinanceChargeTypesByYear | null>(
      `/chargeTypesByYear/${nationalID}/${year}`,
      {},
      auth,
    )

    return result?.resultChargeTypesYear ?? null
  }

  async getChargeTypesDetailsByYear(
    nationalID: string,
    year: string,
    typeId: string,
    auth: Auth,
  ): Promise<FinanceChargeTypeDetails['resultChargeTypeDetails'] | null> {
    const result = await this.get<FinanceChargeTypeDetails | null>(
      `/chargeTypesDetailsByYear/${nationalID}/${year}/${typeId}`,
      {},
      auth,
    )

    return result?.resultChargeTypeDetails ?? null
  }

  async getChargeItemSubjectsByYear(
    nationalID: string,
    year: string,
    typeId: string,
    nextKey: string,
    auth: Auth,
  ): Promise<
    FinanceChargeItemSubjectsByYear['resultSubjectsByYearChargeType'] | null
  > {
    const result = await this.get<FinanceChargeItemSubjectsByYear | null>(
      `/chargeItemSubjectsByYear/${nationalID}/${year}/${typeId}`,
      { nextKey },
      auth,
    )

    return result?.resultSubjectsByYearChargeType ?? null
  }

  async getChargeTypePeriodSubject(
    nationalID: string,
    year: string,
    typeId: string,
    subject: string,
    period: string,
    auth: Auth,
  ): Promise<
    | FinanceRecordsByChargeTypePeriodSubject['resultRecordsByChargeTypePeriodSubject']
    | null
  > {
    const result =
      await this.get<FinanceRecordsByChargeTypePeriodSubject | null>(
        `/recordsByYear/${nationalID}/${year}/${typeId}/${subject}/${period}`,
        {},
        auth,
      )
    return result?.resultRecordsByChargeTypePeriodSubject ?? null
  }
}
