import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration, HomeApi } from '../gen/fetch'
import { HmsRentalAgreementClientConfig } from './hmsRentalAgreement.config'

export const exportedApis = [HomeApi].map((Api) => ({
  provide: Api,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HmsRentalAgreementClientConfig>,
  ) => {
    return new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-hms-rental-agreement',
          organizationSlug: 'hms',
          timeout: 30000,
          autoAuth: {
            mode: 'token',
            issuer: '',
            tokenEndpoint: config.authTokenEndpoint.replace(
              '{TENANT_ID}',
              config.authTenantId,
            ),
            clientId: config.authClientId,
            clientSecret: config.authClientSecret,
            scope: [`api://${config.authClientId}/.default`],
          },
        }),
        headers: { 'X-Road-Client': xRoadConfig.xRoadClient },
        basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      }),
    )
  },
  inject: [XRoadConfig.KEY, HmsRentalAgreementClientConfig.KEY],
}))
