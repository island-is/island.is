import { Configuration, VehiclesApi } from '../../gen/fetch'
import { Injectable, Provider } from '@nestjs/common'
import { PersidnoLookup } from '../../gen/fetch/models'
import {
  ConfigType,
  XRoadConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import { VehiclesClientConfig } from './vehiclesClient.config'
import nodeFetch, { Request } from 'node-fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const VehiclesApiProvider: Provider<VehiclesApi> = {
  provide: VehiclesApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof VehiclesClientConfig>,
  ) =>
    new VehiclesApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-vehicles',
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, VehiclesClientConfig.KEY],
}
/**
    requestedPersidno?: string;  // kennitala
    showDeregistered?: boolean;
    showHistory?: boolean;
    dtFrom?: Date;
    cursor?: string;
    limit?: number;
   */
// public async getVehiclesForUser(ssn: string): Promise<PersidnoLookup> {
//   return await this.api.rootGet({ requestedPersidno: ssn })
// }
// }
