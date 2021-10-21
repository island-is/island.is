import { DynamicModule } from '@nestjs/common'
import { Configuration, DocumentApi } from '../../gen/fetch'
import { HealthInsuranceV2Options } from './clients-health-insurance-v2.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
export class HealthInsuranceV2Module {
  static register(options: HealthInsuranceV2Options): DynamicModule {
    const {
      password,
      username,
      xRoadBaseUrl,
      xRoadClientId,
      xRoadProviderId,
    } = options
    const basePath = `${xRoadBaseUrl}/r1/${xRoadProviderId}/islandis`
    console.log('config : ', options)
    return {
      module: HealthInsuranceV2Module,
      imports: [],
      providers: [
        {
          provide: DocumentApi,
          useFactory: () => {
            return new DocumentApi(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'clients-health-insurance',
                  treat400ResponsesAsErrors: true,
                  logErrorResponseBody: true,
                }),
                basePath: basePath,
                headers: {
                  'X-Road-Client': xRoadClientId,
                  userName: `${username}`,
                  password: `${password}`,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              }),
            )
          },
        },
      ],
      exports: [DocumentApi],
    }
  }
}
