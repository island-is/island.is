import https, { Agent } from 'https'
import fetch from 'isomorphic-fetch'

import { DynamicModule } from '@nestjs/common'

import {
  Configuration,
  AuthenticateApi,
  CreateCustodyCaseApi,
  CreateThingbokApi,
  RequestContext,
  FetchParams,
} from '../../gen/fetch'

function injectAgentMiddleware(agent: Agent) {
  return async (context: RequestContext): Promise<FetchParams> => {
    const { url, init } = context

    return { url, init: { ...init, agent } } as FetchParams
  }
}

export interface CourtClientModuleOptions {
  xRoadPath: string
  xRoadClient: string
  clientCert: string
  clientKey: string
  clientCa: string
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
      middleware: [
        {
          pre: injectAgentMiddleware(
            new https.Agent({
              cert: config.clientCert,
              key: config.clientKey,
              ca: config.clientCa,
              rejectUnauthorized: false,
            }),
          ),
        },
      ],
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
