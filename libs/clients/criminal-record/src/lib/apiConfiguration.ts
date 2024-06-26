import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { CriminalRecordClientConfig } from './criminalRecordApi.config'
import { Configuration } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const ApiConfiguration = {
  provide: 'CriminalRecordClientApiConfiguration',
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof CriminalRecordClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-criminal-record',
        organizationSlug: 'rikislogreglustjori',
      }),
      basePath: `${xRoadConfig.xRoadBasePath}/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xRoadConfig.xRoadClient,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }),
  inject: [XRoadConfig.KEY, CriminalRecordClientConfig.KEY],
}
