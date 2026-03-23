import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { LshClientConfig } from './lsh.config'
import { Provider } from '@nestjs/common'
import { BloodApi, Configuration, QuestionnaireApi } from '../../gen/fetch'

export const LshApiProvider: Provider<BloodApi> = {
  provide: BloodApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof LshClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new BloodApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-lsh',
          organizationSlug: 'landspitali',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.bloodScope,
              }
            : undefined,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.baseUrl}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Road-Client': xroadConfig.xRoadClient,
        },
      }),
    ),
  inject: [XRoadConfig.KEY, LshClientConfig.KEY, IdsClientConfig.KEY],
}

export const LshQuestionnaireApiProvider: Provider<QuestionnaireApi> = {
  provide: QuestionnaireApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof LshClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new QuestionnaireApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-questionnaire-lsh',
          organizationSlug: 'landspitali',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.questionnaireScope,
              }
            : undefined,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.baseUrl}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Road-Client': xroadConfig.xRoadClient,
        },
      }),
    ),
  inject: [XRoadConfig.KEY, LshClientConfig.KEY, IdsClientConfig.KEY],
}
