import { z } from 'zod'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { defineConfig } from '@island.is/nest/config'
import { Configuration, DefaultApi } from '../../gen/fetch'

const schema = z.object({
  xRoadServicePath: z.string(),
  username: z.string(),
  password: z.string(),
})

export const VacanciesClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'VacanciesClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_V2_PATH',
      'IS-DEV/GOV/10021/FJS-Protected/recruitment-v2',
    ),
    username: env.required(
      'ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_USERNAME',
    ),
    password: env.required(
      'ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_PASSWORD',
    ),
  }),
})

export const DefaultApiConfig = {
  provide: 'VacanciesClientConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof VacanciesClientConfig>,
  ) => {
    const credentials = Buffer.from(
      `${config.username}:${config.password}`,
      'binary',
    ).toString('base64')

    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-vacancies',
        organizationSlug: 'fjarsysla-rikisins',
        logErrorResponseBody: true,
        treat400ResponsesAsErrors: true,
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
  inject: [XRoadConfig.KEY, VacanciesClientConfig.KEY],
}

export const DefaultApiProvider = {
  provide: DefaultApi,
  useFactory: (config: Configuration) => {
    return new DefaultApi(config)
  },
  inject: [DefaultApiConfig.provide],
}
