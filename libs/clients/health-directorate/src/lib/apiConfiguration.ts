import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { HealthDirectorateClientConfig } from './healthDirectorateClient.config'
import {
  Configuration,
  StarfsleyfiAMinumSidumApi,
  UmsoknStarfsleyfiApi,
  VottordApi,
} from '../../gen/fetch'
import { Api, Scope } from './healthDirectorateClient.types'
import { ConfigFactory } from './configFactory'

const apiCollection: Array<{
  api: Api
  scopes: Array<Scope>
  autoAuth: boolean
}> = [
  {
    api: StarfsleyfiAMinumSidumApi,
    scopes: ['@landlaeknir.is/starfsleyfi'],
    autoAuth: true,
  },
  {
    api: VottordApi,
    scopes: ['@landlaeknir.is/starfsleyfi'],
    autoAuth: true,
  },
  {
    api: UmsoknStarfsleyfiApi,
    scopes: ['@landlaeknir.is/starfsleyfi'],
    autoAuth: true,
  },
]

export const apiProvider = apiCollection.map((apiRecord) => ({
  provide: apiRecord.api,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HealthDirectorateClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new apiRecord.api(
      new Configuration(
        ConfigFactory(
          xRoadConfig,
          config,
          idsClientConfig,
          apiRecord.scopes,
          apiRecord.autoAuth,
        ),
      ),
    )
  },
  inject: [
    XRoadConfig.KEY,
    HealthDirectorateClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))
