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
        }),
        // headers: { 'X-Road-Client': xRoadConfig.xRoadClient },
        headers: { 'X-Tenant-Identifier': 'reykjavik' },
        // basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        basePath: 'https://app-veita-api-test.azurewebsites.net/applications',
      }),
    )
  },
  inject: [XRoadConfig.KEY, RvkFinancialAidConfig.KEY],
}))
