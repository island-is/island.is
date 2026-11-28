import { Configuration } from '../../gen/fetch'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { SpeechTherapyClientConfig } from './speechTherapyClient.config'

export const SharedApiConfig = {
  provide: 'SpeechTherapyApiProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof SpeechTherapyClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-speech-therapy',
        organizationSlug: 'sjukratryggingar',
        timeout: config.fetch.timeout,
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
        ApiKey: config.apiKey,
        Accept: 'application/json',
      },
    }),
  inject: [XRoadConfig.KEY, SpeechTherapyClientConfig.KEY, IdsClientConfig.KEY],
}
