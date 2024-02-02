import { Provider } from '@nestjs/common'
import { Configuration, DefaultApi as DmrApi } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const DmrApiProvider: Provider<DmrApi> = {
  provide: DmrApi,
  useFactory: () =>
    new DmrApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-dmr',
          organizationSlug: 'domsmalaraduneytid',
        }),
        basePath: 'http://localhost:3000/api',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ),
}
