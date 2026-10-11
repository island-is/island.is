import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration, ForIslandisApi } from '../gen/fetch'
import { RvkFinancialAidConfig } from './rvkFinancialAid.config'

export const exportedApis = [ForIslandisApi].map((Api) => ({
  provide: Api,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof RvkFinancialAidConfig>,
  ) => {
    return new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-rvk-financial-aid',
          organizationSlug: 'reykjavikurborg',
          autoAuth: {
            mode: 'token',
            issuer: '',
            tokenEndpoint: config.rvkVeitaAuthTokenEndpoint,
            clientId: config.rvkVeitaClientId,
            clientSecret: config.rvkVeitaClientSecret,
            scope: [config.rvkVeitaAuthScope],
            headerName: config.rvkVeitaAuthHeaderName,
          },
        }),
        headers: {
          'X-Road-Client': xRoadConfig.xRoadClient,
        },
        basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      }),
    )
  },
  inject: [XRoadConfig.KEY, RvkFinancialAidConfig.KEY],
}))
