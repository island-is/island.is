import { Inject, Injectable } from '@nestjs/common'
import { Configuration, GetDetailedApi, GetSimpleApi } from '../../gen/fetch'
import { RskProcuringClientConfig } from './RskProcuringClientConfig'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import {
  buildCacheControl,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import { caching } from 'cache-manager'
import redisStore from 'cache-manager-ioredis'
import { createRedisCluster } from '@island.is/cache'

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

  getSimple(nationalId: string) {
    return this.simpleApi.simple({ nationalId })
  }

  getDetailed(nationalId: string) {
    return this.detailedApi.detailed({ nationalId })
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
