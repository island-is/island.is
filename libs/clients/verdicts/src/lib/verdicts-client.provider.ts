import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  DefaultApi,
  Configuration as SupremeCourtConfiguration,
} from '../../gen/fetch/supreme-court'
import {
  ExtensionPublishedVerdictApi,
  Configuration as GoProConfiguration,
  ExtensionPublishedBookingApi,
  ExtensionLawyerApi,
  ExternalIntegrationAPISecurityApi,
} from '../../gen/fetch/gopro'
import { VerdictsClientConfig } from './verdicts-client.config'

export const GoProApiConfig = {
  provide: 'GoProVerdictApiConfig',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof VerdictsClientConfig>,
  ) => {
    return new GoProConfiguration({
      fetchApi: createEnhancedFetch({
        name: 'clients-gopro-verdicts',
        logErrorResponseBody: true,
        timeout: 40000,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
    })
  },
  inject: [XRoadConfig.KEY, VerdictsClientConfig.KEY],
}

export const GoProApiProviders = [
  ExtensionPublishedVerdictApi,
  ExtensionPublishedBookingApi,
  ExtensionLawyerApi,
  ExternalIntegrationAPISecurityApi,
].map((api) => ({
  provide: api,
  useFactory: (config: GoProConfiguration) => {
    return new api(config)
  },
  inject: [GoProApiConfig.provide],
}))

export const SupremeCourtApiConfig = {
  provide: 'SupremeCourtVerdictApiConfig',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof VerdictsClientConfig>) => {
    return new SupremeCourtConfiguration({
      fetchApi: createEnhancedFetch({
        name: 'clients-supreme-court-verdicts',
        logErrorResponseBody: true,
        timeout: 40000,
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${config.supremeCourtBearerToken}`,
      },
    })
  },
  inject: [VerdictsClientConfig.KEY],
}

export const SupremeCourtApiProviders = [
  {
    provide: DefaultApi,
    useFactory: (config: SupremeCourtConfiguration) => new DefaultApi(config),
    inject: [SupremeCourtApiConfig.provide],
  },
]
