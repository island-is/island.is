import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { DraftRegulation } from './regulationsAdmin.types'

export const REGULATIONS_ADMIN_OPTIONS = 'REGULATIONS_ADMIN_OPTIONS'

export interface RegulationsAdminOptions {
  url?: string
  ttl?: number
}

export class RegulationsAdminApi extends RESTDataSource {
  constructor(
    @Inject(REGULATIONS_ADMIN_OPTIONS)
    private readonly options: RegulationsAdminOptions,
  ) {
    super()
    // this.baseURL = `${this.options.url}`
    this.baseURL = `http://localhost:3333/api`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  async getDraftRegulation(
    regulationId: string,
  ): Promise<DraftRegulation | null> {
    const response = await this.get<DraftRegulation | null>(
      // `/draft_regulation/${regulationId}`,
      `/draft_regulation/a1fd62db-18a6-4741-88eb-a7b7a7e05833`,
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
      },
    )
    return response
  }
}
