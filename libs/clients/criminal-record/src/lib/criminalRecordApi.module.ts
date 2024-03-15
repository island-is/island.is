import { DynamicModule } from '@nestjs/common'
import {
  createEnhancedFetch,
  EnhancedFetchOptions,
} from '@island.is/clients/middlewares'
import { CriminalRecordApi } from './criminalRecordApi.service'
import { CrimeCertificateApi, Configuration } from '../../gen/fetch'

export interface CriminalRecordApiConfig {
  xroadBaseUrl: string
  xroadClientId: string
  xroadPath: string
  fetchOptions?: Partial<EnhancedFetchOptions>
}

const configFactory = (config: CriminalRecordApiConfig, basePath: string) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-criminal-record',
    organizationSlug: 'rikislogreglustjori',
    ...config.fetchOptions,
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
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
            const api = new CrimeCertificateApi(
              new Configuration(
                configFactory(
                  config,
                  `${config.xroadBaseUrl}/${config.xroadPath}`,
                ),
              ),
            )

            return new CriminalRecordApi(api)
          },
        },
      ],
      exports: [CriminalRecordApi],
    }
  }
}
