import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration } from '../../gen/fetch'

export const FishingLicenseApiFactoryConfig = (
  xRoadProviderId: string,
  xRoadBasePath: string,
  xRoadClient: string,
) =>
  new Configuration({
    fetchApi: createEnhancedFetch({
      name: 'clients-fishing-license',
      treat400ResponsesAsErrors: true,
      logErrorResponseBody: true,
    }),
    basePath: `${xRoadBasePath}/r1/${xRoadProviderId}/`,
    headers: {
      Accept: 'application/json',
      'X-Road-Client': xRoadClient,
    },
  })
