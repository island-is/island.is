import { Inject, Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { RannisGrantResponse } from './rannisGrants.types'
import { RannisGrantDto, mapRannisGrant } from './dtos/rannisGrant.dto'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { RannisGrantsClientConfig } from './rannisGrants.config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class RannisGrantsClientService {
  private readonly fetch: EnhancedFetchAPI
  private readonly baseUrl: string
  constructor(
    @Inject(RannisGrantsClientConfig.KEY)
    private readonly config: ConfigType<typeof RannisGrantsClientConfig>,
  ) {
    this.fetch = createEnhancedFetch({
      name: 'RannisGrantsClient',
      organizationSlug: 'rannis',
    })
    this.baseUrl = config.baseUrl
  }

  getGrants = async (): Promise<Array<RannisGrantDto>> => {
    const grants = await this.fetch(this.baseUrl)

    if (!grants) {
      return []
    }

    const response: RannisGrantResponse = await grants.json()
    return response.map((o) => mapRannisGrant(o)).filter(isDefined)
  }
}
