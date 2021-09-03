/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig } from 'axios'
import { lastValueFrom } from 'rxjs'

import { DocumentOauthConnection } from './documentProvider.connection'
import type { DocumentProviderClientConfig } from './documentProviderClientConfig'
import { DOCUMENT_PROVIDER_CLIENT_CONFIG_PROD } from './documentProviderClientConfig'
import {
  ClientCredentials,
  AudienceAndScope,
  TestResult,
  Statistics,
} from './models'

interface StatisticPayload {
  [key: string]: any
}

@Injectable()
export class DocumentProviderClientProd {
  private accessToken!: string
  private accessTokenExpiryDate!: Date

  constructor(
    private httpService: HttpService,
    @Inject(DOCUMENT_PROVIDER_CLIENT_CONFIG_PROD)
    private clientConfig: DocumentProviderClientConfig,
  ) {}

  private async rehydrateToken() {
    if (
      !this.accessTokenExpiryDate ||
      this.accessTokenExpiryDate < new Date()
    ) {
      const { token, expiresIn } = await DocumentOauthConnection.fetchToken(
        this.clientConfig,
      )
      this.accessToken = token
      const expiryTime = new Date()
      expiryTime.setSeconds(expiryTime.getSeconds() + expiresIn)
      this.accessTokenExpiryDate = expiryTime
    }
  }

  private async postRequest<T>(requestRoute: string, body?: any): Promise<T> {
    await this.rehydrateToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }

    const response: {
      data: T
    } = await lastValueFrom(
      this.httpService.post(
        `${this.clientConfig.basePath}${requestRoute}`,
        body ?? null,
        config,
      ),
    )

    return response.data
  }

  async createClient(
    nationalId: string,
    clientName: string,
  ): Promise<ClientCredentials> {
    const requestRoute = `/api/DocumentProvider/createclient?nationalId=${nationalId}&clientName=${clientName}`
    return await this.postRequest<ClientCredentials>(requestRoute)
  }

  async updateEndpoint(
    providerId: string,
    endpoint: string,
    xroad: boolean,
  ): Promise<AudienceAndScope> {
    const requestRoute = `/api/DocumentProvider/updateendpoint?providerId=${providerId}&endpoint=${endpoint}&xroad=${xroad}`
    return await this.postRequest<AudienceAndScope>(requestRoute)
  }

  async runTests(
    providerId: string,
    recipient: string,
    documentId: string,
  ): Promise<TestResult[]> {
    const requestRoute = `/api/documentprovider/runtests?providerId=${providerId}&recipient=${recipient}&documentId=${documentId}`
    return await this.postRequest<TestResult[]>(requestRoute)
  }

  async statisticsTotal(
    providers?: string[],
    fromDate?: string,
    toDate?: string,
  ): Promise<Statistics> {
    const requestRoute = '/api/documentprovider/statistics/total'

    const payload: StatisticPayload = {}

    if (providers) {
      payload.providers = providers
    }

    if (fromDate && toDate) {
      payload.from = fromDate
      payload.to = toDate
    }

    return await this.postRequest<Statistics>(requestRoute, payload)
  }
}
