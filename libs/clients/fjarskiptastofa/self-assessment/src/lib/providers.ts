import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, SelfAssessmentApi } from '../../gen/fetch'
import { FjarskiptastofaSelfAssessmentClientConfig } from './selfAssessment.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof FjarskiptastofaSelfAssessmentClientConfig>,
  acceptHeader: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-fjarskiptastofa-self-assessment',
    organizationSlug: 'fjarskiptastofa',
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
    api: SelfAssessmentApi,
    provide: SelfAssessmentApi,
    acceptHeader: 'application/json',
  },
].map(({ api, provide, acceptHeader }) => ({
  provide: provide,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FjarskiptastofaSelfAssessmentClientConfig>,
  ) => {
    return new api(
      new Configuration(ConfigFactory(xRoadConfig, config, acceptHeader)),
    )
  },
  inject: [
    XRoadConfig.KEY,
    FjarskiptastofaSelfAssessmentClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))
