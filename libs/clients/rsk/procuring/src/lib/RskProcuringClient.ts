import { caching } from 'cache-manager'
import redisStore from 'cache-manager-ioredis'
import { Inject, Injectable } from '@nestjs/common'

import { createRedisCluster } from '@island.is/cache'
import { XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import {
  buildCacheControl,
  createEnhancedFetch,
  FetchError,
} from '@island.is/clients/middlewares'

import {
  Configuration,
  GetDetailedApi,
  GetSimpleApi,
  ResponseDetailed,
  ResponseSimple,
} from '../../gen/fetch'
import { RskProcuringClientConfig } from './RskProcuringClientConfig'

@Injectable()
export class RskProcuringClient {
  private simpleApi: GetSimpleApi
  private detailedApi: GetDetailedApi

  constructor(
    @Inject(RskProcuringClientConfig.KEY)
    private readonly config: ConfigType<typeof RskProcuringClientConfig>,
    @Inject(XRoadConfig.KEY)
    private readonly xRoadConfig: ConfigType<typeof XRoadConfig>,
  ) {
    const configuration = this.getConfiguration()
    this.simpleApi = new GetSimpleApi(configuration)
    this.detailedApi = new GetDetailedApi(configuration)
  }

  getSimple(nationalId: string): Promise<ResponseSimple | null> {
    return this.simpleApi.simple({ nationalId }).catch(this.handle404)
  }

  getDetailed(nationalId: string): Promise<ResponseDetailed | null> {
    return this.detailedApi.detailed({ nationalId }).catch(this.handle404)
  }

  private handle404(error: FetchError): null {
    if (error.name === 'FetchError' && error.status === 404) {
      return null
    }
    throw error
  }

  private getConfiguration() {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-rsk-procuring',
        cache: {
          cacheManager: caching({
            store: redisStore,
            ttl: 0,
            redisInstance: createRedisCluster({
              name: 'clients-rsk-procuring',
              nodes: this.config.redis.nodes,
              ssl: this.config.redis.ssl,
              noPrefix: true,
            }),
          }),
          shared: false,
          overrideCacheControl: buildCacheControl({ maxAge: 60 * 10 }),
        },
      }),
      basePath: `${this.xRoadConfig.xRoadBasePath}/r1/${this.config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': this.xRoadConfig.xRoadClient,
      },
    })
  }
}
