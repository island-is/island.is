import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { ReykjavikUniversityApplicationClientConfig } from './reykjavikUniversityClient.config'

export const ApiConfiguration = {
  provide: 'ReykjavikUniversityApplicationClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof ReykjavikUniversityApplicationClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-university-application-reykjavik-university',
        timeout: config.fetch.timeout,
      }),
      basePath: config.url,
    })
  },
  inject: [ReykjavikUniversityApplicationClientConfig.KEY],
}
