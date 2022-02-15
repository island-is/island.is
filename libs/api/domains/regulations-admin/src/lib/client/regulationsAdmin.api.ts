import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { EditDraftBody } from '../graphql/dto/editDraftRegulation.input'
import { RegulationsAdminClientConfig } from '@island.is/clients/regulations-admin'
import { ConfigType } from '@island.is/nest/config'

export class RegulationsAdminApi extends RESTDataSource {
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

  create(authorization: string): Promise<any> {
    return this.post(`/draft_regulation`, {}, { headers: { authorization } })
  }

  updateById(
    draftId: string,
    body: EditDraftBody,
    authorization: string,
  ): Promise<any> {
    return this.put(`/draft_regulation/${draftId}`, body, {
      headers: { authorization },
    })
  }

  deleteById(draftId: string, authorization: string): Promise<number> {
    return this.delete(`/draft_regulation/${draftId}`, undefined, {
      headers: { authorization },
    })
  }
}
