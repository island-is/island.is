import fetch from 'isomorphic-fetch'

import { DynamicModule } from '@nestjs/common'

import {
  Configuration,
  AuthenticateApi,
  CreateCustodyCaseApi,
  CreateThingbokApi,
} from '../../gen/fetch'

export interface CourtClientModuleOptions {
  xRoadPath: string
  xRoadClient: string
}

export class CourtClientModule {
  static register(config: CourtClientModuleOptions): DynamicModule {
    const headers = {
      'X-Road-Client': config.xRoadClient,
    }

    const providerConfiguration = new Configuration({
      fetchApi: fetch,
      basePath: config.xRoadPath,
      headers,
    })

    const exportedApis = [
      AuthenticateApi,
      CreateCustodyCaseApi,
      CreateThingbokApi,
    ]

    return {
      module: CourtClientModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
