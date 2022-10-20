import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@nestjs/config'
import { TachoNetApi, DriverCardsApi, Configuration } from '../../gen/fetch'
import { DigitalTachographDriversCardClientConfig } from './digitalTachographDriversCardClient.config'

const configFactory = (
  config: ConfigType<typeof DigitalTachographDriversCardClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-digital-tachograph-drivers-card',
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    SECRET: config.secret,
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
    ) => {
      return new TachoNetApi(
        new Configuration(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPath}`),
        ),
      )
    },
    inject: [DigitalTachographDriversCardClientConfig.KEY],
  },
  {
    provide: DriverCardsApi,
    useFactory: (
      config: ConfigType<typeof DigitalTachographDriversCardClientConfig>,
    ) => {
      return new DriverCardsApi(
        new Configuration(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPath}`),
        ),
      )
    },
    inject: [DigitalTachographDriversCardClientConfig.KEY],
  },
]
