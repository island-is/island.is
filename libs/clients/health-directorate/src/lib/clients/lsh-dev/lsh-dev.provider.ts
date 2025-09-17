import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import {
  Configuration,
  AppInfoApi,
  BookAppointmentApi,
  FeedbackApi,
  FoodApi,
  PatientPropertiesApi,
} from './gen/fetch'
import { LshDevConfig } from './lsh-dev.config'

export const LshDevApiConfiguration = {
  provide: 'LshDevApiConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof LshDevConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-lsh-dev',
        organizationSlug: 'landlaeknir',
        timeout: 30000, // 30 sec timeout
        logErrorResponseBody: true,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.scopes,
            }
          : undefined,
      }),
      basePath: 'https://patientappdevws.landspitali.is',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  inject: [LshDevConfig.KEY, IdsClientConfig.KEY],
}

export const exportedLshDevApis = [
  AppInfoApi,
  BookAppointmentApi,
  FeedbackApi,
  FoodApi,
  PatientPropertiesApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [LshDevApiConfiguration.provide],
}))
