import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { RskKilometragjaldReimbursementClientConfig } from './RskKilometragjaldReimbursementClientConfig'

export const RskKilometragjaldReimbursementConfigurationProvider = {
  provide: Configuration,
  useFactory: (
    config: ConfigType<typeof RskKilometragjaldReimbursementClientConfig>,
    xRoadConfig: ConfigType<typeof XRoadConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-rsk-kilometragjald-reimbursement',
        organizationSlug: 'skatturinn',
        // Submissions include the proof of travel documents
        timeout: 60000,
      }),
      basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xRoadConfig.xRoadClient,
      },
    }),
  inject: [RskKilometragjaldReimbursementClientConfig.KEY, XRoadConfig.KEY],
}
