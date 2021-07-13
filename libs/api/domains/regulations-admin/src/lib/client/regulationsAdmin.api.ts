import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { DB_RegulationDraft } from '@island.is/regulations/admin'

export const REGULATIONS_ADMIN_OPTIONS = 'REGULATIONS_ADMIN_OPTIONS'

export interface RegulationsAdminOptions {
  baseApiUrl?: string
  regulationsApiUrl: string
  ttl?: number
}

export class RegulationsAdminApi extends RESTDataSource {
  constructor(
    @Inject(REGULATIONS_ADMIN_OPTIONS)
    private readonly options: RegulationsAdminOptions,
  ) {
    super()
    this.baseURL = `${this.options.baseApiUrl}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  async getDraftRegulations(authorization: string): Promise<DB_RegulationDraft[]> {
    const response = await this.get<DB_RegulationDraft[]>(
      '/draft_regulations',
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
        headers: { authorization },
      },
    )
    // TODO:  get authors
    return response
  }

  async getShippedRegulations(
    authorization: string,
  ): Promise<DB_RegulationDraft[]> {
    const response = await this.get<DB_RegulationDraft[]>(
      `/draft_regulations_shipped`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
        headers: { authorization },
      },
    )

    // TODO:  get ministry, get lawchapter, get author
    return response
  }

  async getDraftRegulation(
    regulationId: string,
    authorization: string,
  ): Promise<DB_RegulationDraft | null> {
    const response = await this.get<DB_RegulationDraft | null>(
      // `/draft_regulation/${regulationId}`,
      `/draft_regulation/a1fd62db-18a6-4741-88eb-a7b7a7e05833`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
        headers: { authorization },
      },
    )
    // TODO:  get authors
    return response
  }
}
