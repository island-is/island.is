import { Provider } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { Configuration, StatisticsApi } from '../../gen/fetch'
import { ElectronicRegistrationsClientConfig } from './electronicRegistrations.config'

export const ApiProvider: Provider<StatisticsApi> = {
  provide: StatisticsApi,
  scope: LazyDuringDevScope,
  useFactory: (
    clientConfig: ConfigType<typeof ElectronicRegistrationsClientConfig>,
  ) => {
    return new StatisticsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-electronic-registration-statistics',
          organizationSlug: 'thjodskra-islands',
          ...clientConfig.fetch,
        }),
        basePath: clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )
  },
  inject: [ElectronicRegistrationsClientConfig.KEY],
}
