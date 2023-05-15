import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { Configuration, MachinesApi } from '../../gen/fetch'
import { WorkMachinesClientConfig } from './work-machines.config'
import { Provider } from '@nestjs/common'

export const WorkMachinesApiProvider: Provider<MachinesApi> = {
  provide: MachinesApi,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof WorkMachinesClientConfig>) =>
    new MachinesApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-work-machines-license',
          logErrorResponseBody: true,
          timeout: config.fetch.timeout,
        }),
      }),
    ),
  inject: [WorkMachinesClientConfig.KEY],
}
