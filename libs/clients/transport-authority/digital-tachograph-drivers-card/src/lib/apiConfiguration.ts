import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import {
  DriverCardsApiApi,
  IndividualApiApi,
  Configuration,
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
    provide: DriverCardsApiApi,
    useFactory: (
      config: ConfigType<typeof DigitalTachographDriversCardClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new DriverCardsApiApi(
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
    provide: IndividualApiApi,
    useFactory: (
      config: ConfigType<typeof DigitalTachographDriversCardClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new IndividualApiApi(
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
