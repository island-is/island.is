import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration } from '../../gen/fetch'
import { FormSystemClientConfig } from './FormSystemClient.config'
import { ConfigType } from '@island.is/nest/config'

export const ApiConfiguration = {
  provide: 'FormSystemClientApiConfiguration',
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (config: ConfigType<typeof FormSystemClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'form-system',
        organizationSlug: 'stafraent-island',
        logErrorResponseBody: true,
      }),
      basePath: config.basePath,
      headers: {
        Accept: 'application/json',
      },
    })
  },
  inject: [FormSystemClientConfig.KEY],
}
