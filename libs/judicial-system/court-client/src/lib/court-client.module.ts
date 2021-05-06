import https, { Agent } from 'https'
import fetch from 'isomorphic-fetch'

import { DynamicModule } from '@nestjs/common'

import {
  AuthenticateApi,
  Configuration,
  CreateCaseApi,
  CreateCustodyCaseApi,
  FetchParams,
  RequestContext,
} from '../../gen/fetch'
import {
  CourtClientService,
  COURT_SERVICE_OPTIONS,
} from './court-client.service'

const apis = [AuthenticateApi, CreateCaseApi, CreateCustodyCaseApi]

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
  username: string
  password: string
}

export class CourtClientModule {
  static register(options: CourtClientModuleOptions): DynamicModule {
    const providerConfiguration = new Configuration({
      fetchApi: fetch,
      basePath: options.xRoadPath,
      headers: {
        'X-Road-Client': options.xRoadClient,
      },
      middleware: [
        {
          pre: injectAgentMiddleware(
            new https.Agent({
              cert: options.clientCert,
              key: options.clientKey,
              ca: options.clientCa,
              rejectUnauthorized: false, // Must be false because we are using self signed certificates
            }),
          ),
        },
      ],
    })
    return {
      module: CourtClientModule,
      providers: [
        ...apis.map((api) => ({
          provide: api,
          useFactory: () => new api(providerConfiguration),
        })),
        {
          provide: COURT_SERVICE_OPTIONS,
          useFactory: () => ({
            username: options.username,
            password: options.password,
          }),
        },
        CourtClientService,
      ],
      exports: [CourtClientService],
    }
  }
}
