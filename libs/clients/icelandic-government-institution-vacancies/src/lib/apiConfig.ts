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
  ) => {
    const credentials = Buffer.from(
      `${config.username}:${config.password}`,
      'binary',
    ).toString('base64')

    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-icelandic-government-institution-vacancies',
        organizationSlug: 'fjarsysla-rikisins',
        logErrorResponseBody: true,
        timeout: 20000,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
    })
  },
  inject: [
    XRoadConfig.KEY,
    IcelandicGovernmentInstitutionVacanciesClientConfig.KEY,
  ],
}
