import { DynamicModule } from '@nestjs/common'
import {
  createEnhancedFetch,
  EnhancedFetchOptions,
} from '@island.is/clients/middlewares'
import { MortgageCertificateApi } from './mortgageCertificateApi.service'
// TODOx mortgateApi
// import { CrimeCertificateApi, Configuration } from '../../gen/fetch'

export interface MortgageCertificateApiConfig {
  xroadBaseUrl: string
  xroadClientId: string
  xroadPath: string
  fetchOptions?: Partial<EnhancedFetchOptions>
}

const configFactory = (
  config: MortgageCertificateApiConfig,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-mortgage-certificate',
    ...config.fetchOptions,
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export class MortgageCertificateApiModule {
  static register(config: MortgageCertificateApiConfig): DynamicModule {
    return {
      module: MortgageCertificateApiModule,
      providers: [
        {
          provide: MortgageCertificateApi,
          useFactory: () => {
            // const api = new CrimeCertificateApi(
            //   new Configuration(
            //     configFactory(
            //       config,
            //       `${config.xroadBaseUrl}/${config.xroadPath}`,
            //     ),
            //   ),
            // )

            // return new MortgageCertificateApi(api)
            return new MortgageCertificateApi()
          },
        },
      ],
      exports: [MortgageCertificateApi],
    }
  }
}
