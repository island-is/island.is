import { DynamicModule, Module } from '@nestjs/common'
import { Configuration, EhicApi } from '../../gen/fetch'
import { ClientsEhicClientV1ClientOptions } from './clients-ehic-client-v1.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export class ClientsEhicClientV1Client {
  static register(options: ClientsEhicClientV1ClientOptions): DynamicModule {
    const {
      password,
      username,
      xRoadBaseUrl,
      xRoadClientId,
      xRoadProviderId,
    } = options
    const basePath = `https://midgardur-test.sjukra.is/ehic` // const basePath = `${xRoadBaseUrl}/r1/${xRoadProviderId}/islandis`

    const configuration = new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-european-health-insurance',
        treat400ResponsesAsErrors: true,
        logErrorResponseBody: true,
        timeout: 20000, // needed because the external service is taking a while to respond to submitting the document
      }),
      basePath: basePath,
      headers: {
        // 'X-Road-Client': xRoadClientId,
        // userName: `${username}`,
        // password: `${password}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return {
      module: ClientsEhicClientV1Client,
      imports: [],
      providers: [
        {
          provide: EhicApi,
          useFactory: () => {
            return new EhicApi(configuration)
          },
        },
      ],
      exports: [EhicApi],
    }
  }
}
