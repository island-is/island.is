import { DynamicModule } from '@nestjs/common'
import {
  createEnhancedFetch,
  EnhancedFetchOptions,
} from '@island.is/clients/middlewares'
import { CriminalRecordApi } from './criminalRecordApi.service'
// import { ApiV1, ConfigV1 } from '../v1'
// import { ApiV2, ConfigV2 } from '../v2'

export interface CriminalRecordApiConfig {
  xroadBaseUrl: string
  xroadClientId: string
  secret: string
  xroadPath: string
  fetchOptions?: Partial<EnhancedFetchOptions>
}

const configFactory = (config: CriminalRecordApiConfig, basePath: string) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-criminal-record',
    ...config.fetchOptions,
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    SECRET: config.secret,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export class CriminalRecordApiModule {
  static register(config: CriminalRecordApiConfig): DynamicModule {
    return {
      module: CriminalRecordApiModule,
      providers: [
        {
          provide: CriminalRecordApi,
          useFactory: () => {
            return new CriminalRecordApi()
          },
        },
      ],
      exports: [CriminalRecordApi],
    }
  }
}
