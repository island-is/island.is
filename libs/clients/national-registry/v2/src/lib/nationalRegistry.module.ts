import * as z from 'zod'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { EnhancedFetchOptions } from '@island.is/clients/middlewares'
import { ConfigType, defineConfig } from '@island.is/nest/config'

import {
  Configuration,
  EinstaklingarApi,
  FasteignirApi,
  LyklarApi,
} from '../../gen/fetch'
import { CACHE_MANAGER, Module } from "@nestjs/common";

const XRoadConfig = defineConfig({
  name: 'XRoadConfig',
  load: (env) => ({
    xRoadBasePath: env.required('XROAD_BASE_PATH', 'http://localhost:8080'),
    xRoadClient: env.required(
      'XROAD_CLIENT_ID',
      'IS-DEV/GOV/10000/island-is-client',
    ),
  }),
})

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int().optional(),
  }),
})

const NationalRegistryConfig = defineConfig({
  name: 'NationalRegistryClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
        'IS-DEV/GOV/10001/SKRA-Protected/Einstaklingar-v1',
      ),
      fetch: {
        timeout: env.optionalJSON('XROAD_NATIONAL_REGISTRY_TIMEOUT'),
      },
    }
  },
})

export interface ModuleConfig {
  xRoadPath: string
  xRoadClient: string
  fetch?: Partial<EnhancedFetchOptions>
}

const exportedApis = [EinstaklingarApi, FasteignirApi, LyklarApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (
      xroadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof NationalRegistryConfig>,
      cacheManager: Cache,
    ) => {
      return new Api(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-national-registry-v2',
            cache: {
              cacheManager,
            },
            ...config.fetch,
          }),
          basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        }),
      )
    },
    inject: [XRoadConfig.KEY, NationalRegistryConfig.KEY, CACHE_MANAGER],
  }),
)

@Module({
  providers: exportedApis,
  exports: exportedApis,
})
export class NationalRegistryModule {}
