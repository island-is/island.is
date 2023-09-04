import { DynamicModule } from '@nestjs/common'
import { Configuration, DocumentApi, PersonApi } from '../../gen/fetch'
import { HealthInsuranceV2Options } from './clients-health-insurance-v2.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export class HealthInsuranceV2Client {
  static register(options: HealthInsuranceV2Options): DynamicModule {
    const { password, username, xRoadBaseUrl, xRoadClientId, xRoadProviderId } =
      options
    const basePath = `${xRoadBaseUrl}/r1/${xRoadProviderId}/islandis`

    const configuration = new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-health-insurance',
        organizationSlug: 'sjukratryggingar',
        treat400ResponsesAsErrors: true,
        logErrorResponseBody: true,
        timeout: 20000, // needed because the external service is taking a while to respond to submitting the document
      }),
      basePath: basePath,
      headers: {
        'X-Road-Client': xRoadClientId,
        userName: `${username}`,
        password: `${password}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return {
      module: HealthInsuranceV2Client,
      imports: [],
      providers: [
        {
          provide: DocumentApi,
          useFactory: () => {
            return new DocumentApi(configuration)
          },
        },
        {
          provide: PersonApi,
          useFactory: () => {
            return new PersonApi(configuration)
          },
        },
      ],
      exports: [DocumentApi, PersonApi],
    }
  }
}
