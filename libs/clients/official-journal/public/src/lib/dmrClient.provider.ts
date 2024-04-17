import { Provider } from '@nestjs/common'
import { Configuration, DefaultApi as DmrApi } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { DmrClientConfig } from './dmrClient.config'
import { ConfigType } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'

export const DmrApiProvider: Provider<DmrApi> = {
  provide: DmrApi,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof DmrClientConfig>,
  ) => {
    return new DmrApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-dmr',
          organizationSlug: 'domsmalaraduneytid',
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    )
  },
  inject: [XRoadConfig.KEY, DmrClientConfig.KEY],
}
