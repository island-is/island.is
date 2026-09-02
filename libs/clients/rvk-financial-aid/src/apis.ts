import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { OrganizationSlugType } from '@island.is/shared/constants'
import {
  ApplicationsApi,
  DocumentsApi,
  NotificationsApi,
  SettingsApi,
  Configuration,
} from '../gen/fetch'
import { RvkFinancialAidConfig } from './rvkFinancialAid.config'

export const exportedApis = [
  ApplicationsApi,
  DocumentsApi,
  NotificationsApi,
  SettingsApi,
].map((Api) => ({
  provide: Api,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof RvkFinancialAidConfig>,
  ) => {
    return new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: Api.name,
          organizationSlug: 'reykjavikurborg',
          autoAuth: {
            mode: 'token',
            issuer: '',
            tokenEndpoint:
              'https://login.microsoftonline.com/6aed0be3-a6ff-4c6c-83b5-bb72bdd10088/oauth2/v2.0/token',
            clientId: config.rvkVeitaClientId,
            clientSecret: config.rvkVeitaClientSecret,
            scope: ['api://veita-api.test.reykjavik.is/.default'],
          },
        }),
        // headers: { 'X-Road-Client': xRoadConfig.xRoadClient },
        headers: { 'X-Tenant-Identifier': 'reykjavik' },
        // basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        basePath: config.rvkVeitaBaseUrl,
      }),
    )
  },
  inject: [XRoadConfig.KEY, RvkFinancialAidConfig.KEY],
}))
