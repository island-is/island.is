import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration } from '../../gen/fetch'
import { HealthInsuranceV2ClientConfig } from './clients-health-insurance-v2.config'

export const ApiConfiguration = {
  provide: 'HealthInsuranceV2ClientApiConfiguration',
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HealthInsuranceV2ClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-health-insurance',
        organizationSlug: 'sjukratryggingar',
        logErrorResponseBody: true,
        timeout: 20000, // needed because the external service is taking a while to respond to submitting the document
      }),
      basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}/islandis`,
      headers: {
        'X-Road-Client': xRoadConfig.xRoadClient,
        userName: `${config.username}`,
        password: `${config.password}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  inject: [XRoadConfig.KEY, HealthInsuranceV2ClientConfig.KEY],
}
