import { caching } from 'cache-manager'
import redisStore from 'cache-manager-ioredis'
import { Inject, Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { createRedisCluster } from '@island.is/cache'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
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
    @Inject(IdsClientConfig.KEY)
    private readonly idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    const configuration = this.getConfiguration()
    this.simpleApi = new GetSimpleApi(configuration)
    this.detailedApi = new GetDetailedApi(configuration)
  }

  simpleApiWithAuth(auth: Auth) {
    return this.simpleApi.withMiddleware(new AuthMiddleware(auth))
  }

  detailedApiWithAuth(auth: Auth) {
    return this.detailedApi.withMiddleware(new AuthMiddleware(auth))
  }

  getSimple(user: User): Promise<ResponseSimple | null> {
    return this.simpleApiWithAuth(user)
      .simple({ nationalId: user.nationalId })
      .catch(this.handle404)
  }

  getDetailed(user: User): Promise<ResponseDetailed | null> {
    return this.detailedApiWithAuth(user)
      .detailed({ nationalId: user.nationalId })
      .catch(this.handle404)
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
        cache:
          this.config.redis.nodes.length === 0
            ? undefined
            : {
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
        autoAuth: !this.idsClientConfig.isConfigured
          ? undefined
          : {
              mode: 'tokenExchange',
              issuer: this.idsClientConfig.issuer,
              clientId: this.idsClientConfig.clientId,
              clientSecret: this.idsClientConfig.clientSecret,
              scope: this.config.tokenExchangeScope,
            },
      }),
      basePath: `${this.xRoadConfig.xRoadBasePath}/r1/${this.config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': this.xRoadConfig.xRoadClient,
      },
    })
  }
}
