import { Inject, Injectable } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { ConfigType } from '@nestjs/config'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { RegName } from '@island.is/regulations'
import { RegulationsClientConfig } from './regulations.config'
import { UiRegulation, UpdateResponse } from './types'
const LOG_CATEGORY = 'clients-regulation'

@Injectable()
export class RegulationsPublishService extends RESTDataSource {
  constructor(
    @Inject(RegulationsClientConfig.KEY)
    private readonly options: ConfigType<typeof RegulationsClientConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    super()
    this.baseURL = `${this.options.url}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    // We need to clear the memoized cache for every request to make sure
    // updates are live when editing and viewing
    this.memoizedResults.clear()
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('X-User', 'USER_NAME')
    request.headers.set('X-PublishKey', this.options.regulationPublishKey)
  }

  async postRegulationSave(body: UiRegulation): Promise<UpdateResponse> {
    const response = await this.post<UpdateResponse>(
      'regulations/publish/save-regulation',
      body,
    )
    return response
  }
}
