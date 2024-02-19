import { Provider } from '@nestjs/common'
import { Configuration, DefaultApi as DmrApi } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { DmrClientConfig } from './dmrClient.config'

export const DmrApiProvider: Provider<DmrApi> = {
  provide: DmrApi,
  useFactory: (config) => {
    return new DmrApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-dmr',
          organizationSlug: 'domsmalaraduneytid',
        }),
        basePath: config.basePath,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )
  },
  inject: [DmrClientConfig.KEY],
}
