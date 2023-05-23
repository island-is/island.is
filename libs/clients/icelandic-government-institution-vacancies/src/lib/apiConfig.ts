import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { IcelandicGovernmentInstitutionVacanciesClientConfig } from './icelandicGovernmentInstitutionVacanciesClient.config'

export const ApiConfig = {
  provide: 'IcelandicGovernmentInstitutionVacanciesClientConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<
      typeof IcelandicGovernmentInstitutionVacanciesClientConfig
    >,
  ) =>
    new Configuration({
      username: config.username,
      password: config.password,
      fetchApi: createEnhancedFetch({
        name: 'clients-icelandic-government-institution-vacancies',
        logErrorResponseBody: true,
        treat400ResponsesAsErrors: true,
        // TODO: perhaps add a timeout,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  inject: [
    XRoadConfig.KEY,
    IcelandicGovernmentInstitutionVacanciesClientConfig.KEY,
  ],
}
