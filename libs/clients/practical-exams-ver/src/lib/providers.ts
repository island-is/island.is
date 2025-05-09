import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  ExamCategoriesApi,
  Configuration,
  InstructorApi,
  CompanyApi,
  ExamineeValidationApi,
  ExamineeEligibilityApi,
  ExamRegistrationApi,
  PostCodeApi,
} from '../../gen/fetch'
import { PracticalExamsClientConfig } from './practicalExams.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof PracticalExamsClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  acceptHeader: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-practical-exams-ver',
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
    api: ExamCategoriesApi,
    provide: ExamCategoriesApi,
    acceptHeader: 'application/json',
  },
  {
    api: ExamineeValidationApi,
    provide: ExamineeValidationApi,
    acceptHeader: 'application/json',
  },
  {
    api: InstructorApi,
    provide: InstructorApi,
    acceptHeader: 'application/json',
  },
  {
    api: CompanyApi,
    provide: CompanyApi,
    acceptHeader: 'application/json',
  },
  {
    api: ExamineeEligibilityApi,
    provide: ExamineeEligibilityApi,
    acceptHeader: 'application/json',
  },
  {
    api: ExamRegistrationApi,
    provide: ExamRegistrationApi,
    acceptHeader: 'application/json',
  },
  {
    api: PostCodeApi,
    provide: PostCodeApi,
    acceptHeader: 'application/json',
  },
].map(({ api, provide, acceptHeader }) => ({
  provide: provide,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof PracticalExamsClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new api(
      new Configuration(
        ConfigFactory(xRoadConfig, config, idsClientConfig, acceptHeader),
      ),
    )
  },
  inject: [
    XRoadConfig.KEY,
    PracticalExamsClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))
