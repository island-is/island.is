import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { NationalAgencyForChildrenAndFamiliesClientConfig } from './nationalAgencyForChildrenAndFamiliesClient.config'

export const ApiConfiguration = {
  provide: 'NationalAgencyForChildrenAndFamiliesApiConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof NationalAgencyForChildrenAndFamiliesClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-agency-for-children-and-families',
        autoAuth: {
          mode: 'token',
          issuer: `${xroadConfig.xRoadBasePath}/r1/${config.xroadAuthPath}`,
          tokenEndpoint: `${xroadConfig.xRoadBasePath}/r1/${config.xroadAuthPath}/connect/token`,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          scope: config.scope,
          tokenRequestHeaders: { 'X-Road-Client': xroadConfig.xRoadClient },
        },
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xroadApiPath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  inject: [
    NationalAgencyForChildrenAndFamiliesClientConfig.KEY,
    XRoadConfig.KEY,
  ],
}
