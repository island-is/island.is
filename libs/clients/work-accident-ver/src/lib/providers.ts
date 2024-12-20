import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  Configuration,
  CompanySettingsApi,
  DataApi,
  AccidentsApi,
} from '../../gen/fetch'
import { WorkAccidentClientConfig } from './workAccident.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof WorkAccidentClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  acceptHeader: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-work-accident-ver',
    organizationSlug: 'vinnueftirlitid',
    logErrorResponseBody: true,
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'tokenExchange',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: config.fetch.scope,
        }
      : undefined,
  }),
  basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
  headers: {
    'X-Road-Client': xroadConfig.xRoadClient,
    Accept: acceptHeader,
  },
})

export const exportedApis = [
  {
    api: DataApi,
    provide: DataApi,
    acceptHeader: 'application/json',
  },
  {
    api: CompanySettingsApi,
    provide: CompanySettingsApi,
    acceptHeader: 'application/json',
  },
  {
    api: AccidentsApi,
    provide: AccidentsApi,
    acceptHeader: 'application/json',
  },
].map(({ api, provide, acceptHeader }) => ({
  provide: provide,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof WorkAccidentClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new api(
      new Configuration(
        ConfigFactory(xRoadConfig, config, idsClientConfig, acceptHeader),
      ),
    )
  },
  inject: [XRoadConfig.KEY, WorkAccidentClientConfig.KEY, IdsClientConfig.KEY],
}))
