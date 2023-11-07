import { Inject } from '@nestjs/common'

import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { Auth } from '@island.is/auth-nest-tools'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { HmsLoansClientConfig } from './hmsLoans.config'
import { GreidsluYfirlitReturnModel, LanaYfirlitReturnModel } from '..'

export class HmsLoansClientService {
  baseURL: string
  fetch: EnhancedFetchAPI

  constructor(
    @Inject(HmsLoansClientConfig.KEY)
    private readonly config: ConfigType<typeof HmsLoansClientConfig>,
    @Inject(XRoadConfig.KEY)
    private readonly xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(IdsClientConfig.KEY)
    private readonly idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    this.baseURL = `${this.xroadConfig.xRoadBasePath}/r1/${this.config.xRoadServicePath}`
    this.fetch = createEnhancedFetch({
      name: 'clients-hms-loans',
      organizationSlug: 'husnaedis-og-mannvirkjastofnun',
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

  async getHmsLoanslanayfirlit(nationalID: string, auth: Auth) {
    return this.get<LanaYfirlitReturnModel[] | null>(
      `/greidsluyfirlit`,
      {
        kennitala: nationalID,
      },
      auth,
    )
  }

  async getHmsLoansGreidsluyfirlit(nationalID: string, auth: Auth) {
    return this.get<GreidsluYfirlitReturnModel[] | null>(
      `/lanayfirlit`,
      {
        kennitala: nationalID,
      },
      auth,
    )
  }
}
