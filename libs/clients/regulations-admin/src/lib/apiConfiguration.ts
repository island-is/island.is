import { Configuration } from '../../gen/fetch'

import { RegulationsAdminClientConfig } from './RegulationsAdminClientConfig'
import { ConfigType } from '@nestjs/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const ApiConfiguration = {
  provide: 'RegulationsAdminClientConfiguration',
  useFactory: (config: ConfigType<typeof RegulationsAdminClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'Regulations-AdminClientService',
        organizationSlug: 'domsmalaraduneytid',
        logErrorResponseBody: true,
      }),
      basePath: config.baseApiUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  },
  inject: [RegulationsAdminClientConfig.KEY],
}
