import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import {
  TachoNetApi,
  DriverCardsApi,
  Configuration,
  IndividualApi,
} from '../../gen/fetch'
import { DigitalTachographDriversCardClientConfig } from './digitalTachographDriversCardClient.config'

const configFactory = (
  config: ConfigType<typeof DigitalTachographDriversCardClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-digital-tachograph-drivers-card',
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'tokenExchange',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: config.scope,
        }
      : undefined,
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const exportedApis = [
  {
    provide: TachoNetApi,
    useFactory: (
      config: ConfigType<typeof DigitalTachographDriversCardClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new TachoNetApi(
        new Configuration(
          configFactory(
            config,
            idsClientConfig,
            `${config.xroadBaseUrl}/r1/${config.xroadPath}`,
          ),
        ),
      )
    },
    inject: [DigitalTachographDriversCardClientConfig.KEY, IdsClientConfig.KEY],
  },
  {
    provide: DriverCardsApi,
    useFactory: (
      config: ConfigType<typeof DigitalTachographDriversCardClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new DriverCardsApi(
        new Configuration(
          configFactory(
            config,
            idsClientConfig,
            `${config.xroadBaseUrl}/r1/${config.xroadPath}`,
          ),
        ),
      )
    },
    inject: [DigitalTachographDriversCardClientConfig.KEY, IdsClientConfig.KEY],
  },
  {
    provide: IndividualApi,
    useFactory: (
      config: ConfigType<typeof DigitalTachographDriversCardClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new IndividualApi(
        new Configuration(
          configFactory(
            config,
            idsClientConfig,
            `${config.xroadBaseUrl}/r1/${config.xroadPath}`,
          ),
        ),
      )
    },
    inject: [DigitalTachographDriversCardClientConfig.KEY, IdsClientConfig.KEY],
  },
]
