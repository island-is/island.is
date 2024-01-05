import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { AircraftRegistryClientConfig } from './aircraftRegistryClient.config'

export const ApiConfig = {
  provide: 'IcelandicGovernmentInstitutionVacanciesClientConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof AircraftRegistryClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-aircraft-registry',
        organizationSlug: 'samgongustofa',
        treat400ResponsesAsErrors: true,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  },
  inject: [XRoadConfig.KEY, AircraftRegistryClientConfig.KEY],
}
