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
          name: Api.name,
          organizationSlug: 'hms',
          autoAuth: {
            issuer: config.authTokenEndpoint.replace(
              '{TENANT_ID}',
              config.authTenantId,
            ),
            tokenEndpoint: config.authTokenEndpoint.replace(
              '{TENANT_ID}',
              config.authTenantId,
            ),
            clientId: config.authClientId,
            clientSecret: config.authClientSecret,
            scope: [`api://${config.authClientId}/.default`],
            mode: 'token',
          },
        }),
        headers: { 'X-Road-Client': xRoadConfig.xRoadClient },
        basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      }),
    )
  },
  inject: [XRoadConfig.KEY, HmsRentalAgreementClientConfig.KEY],
}))
