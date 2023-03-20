import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import {
  RegulationDraft,
  ShippedSummary,
  TaskListType,
} from '@island.is/regulations/admin'
import { RegulationsAdminClientConfig } from './RegulationsAdminClientConfig'
import { ConfigType } from '@nestjs/config'

export class RegulationsAdminClientService extends RESTDataSource {
  constructor(
    @Inject(RegulationsAdminClientConfig.KEY)
    private readonly config: ConfigType<typeof RegulationsAdminClientConfig>,
  ) {
    super()
    this.baseURL = `${this.config.baseApiUrl}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    this.memoizedResults.clear()
    request.headers.set('Content-Type', 'application/json')
  }

  async getDraftRegulations(authorization: string, page?: number) {
    return await this.get<TaskListType>(
      '/draft_regulations',
      {
        page,
      },
      {
        headers: { authorization },
      },
    )
  }

  async getShippedRegulations(authorization: string) {
    return await this.get<ShippedSummary[]>(
      `/draft_regulations_shipped`,
      {},
      {
        headers: { authorization },
      },
    )
  }

  async getDraftRegulation(
    draftId: string,
    authorization: string,
  ): Promise<RegulationDraft | null> {
    const response = await this.get<RegulationDraft | null>(
      `/draft_regulation/${draftId}`,
      {},
      {
        headers: { authorization },
      },
    )
    return response
  }
}
