import { ConfigType } from '@nestjs/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { LazyDuringDevScope } from '@island.is/nest/config'
import {
  DefaultApi,
  Configuration as SupremeCourtConfiguration,
} from '../../gen/fetch/supreme-court'
import {
  VerdictApi,
  Configuration as GoProConfiguration,
  BookingApi,
  LawyerApi,
} from '../../gen/fetch/gopro'
import { VerdictsClientConfig } from './verdicts-client.config'

export const GoProApiConfig = {
  provide: 'GoProVerdictApiConfig',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof VerdictsClientConfig>) => {
    return new GoProConfiguration({
      fetchApi: createEnhancedFetch({
        name: 'clients-gopro-verdicts',
        logErrorResponseBody: true,
        timeout: 40000,
      }),
      headers: {
        Accept: 'application/json',
      },
      username: config.goproUsername,
      password: config.goproPassword,
    })
  },
  inject: [VerdictsClientConfig.KEY],
}

export const GoProApiProviders = [VerdictApi, BookingApi, LawyerApi].map(
  (api) => ({
    provide: api,
    useFactory: (config: GoProConfiguration) => {
      return new api(config)
    },
    inject: [GoProApiConfig.provide],
  }),
)

export const SupremeCourtApiConfig = {
  provide: 'SupremeCourtVerdictApiConfig',
  scope: LazyDuringDevScope,
  useFactory: () => {
    return new SupremeCourtConfiguration({
      fetchApi: createEnhancedFetch({
        name: 'clients-supreme-court-verdicts',
        logErrorResponseBody: true,
        timeout: 40000,
      }),
      headers: {
        Accept: 'application/json',
      },
    })
  },
}

export const SupremeCourtApiProviders = [
  {
    provide: DefaultApi,
    useFactory: (config: SupremeCourtConfiguration) => new DefaultApi(config),
    inject: [SupremeCourtApiConfig.provide],
  },
]
