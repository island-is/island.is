import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  CompanyApi,
  Configuration,
  CourseApi,
  RegistrationApi,
  IndividualApi,
} from '../../gen/fetch'
import { SeminarsClientConfig } from './seminars.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof SeminarsClientConfig>,
  acceptHeader: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-seminars-ver',
    organizationSlug: 'vinnueftirlitid',
    logErrorResponseBody: true,
  }),
  basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
  headers: {
    'X-Road-Client': xroadConfig.xRoadClient,
    Accept: acceptHeader,
  },
})

export const exportedApis = [
  {
    api: CourseApi,
    provide: CourseApi,
    acceptHeader: 'application/json',
  },
  {
    api: CompanyApi,
    provide: CompanyApi,
    acceptHeader: 'application/json',
  },
  {
    api: RegistrationApi,
    provide: RegistrationApi,
    acceptHeader: 'application/json',
  },
  {
    api: IndividualApi,
    provide: IndividualApi,
    acceptHeader: 'application/json',
  },
].map(({ api, provide, acceptHeader }) => ({
  provide: provide,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof SeminarsClientConfig>,
  ) => {
    return new api(
      new Configuration(ConfigFactory(xRoadConfig, config, acceptHeader)),
    )
  },
  inject: [XRoadConfig.KEY, SeminarsClientConfig.KEY, IdsClientConfig.KEY],
}))
