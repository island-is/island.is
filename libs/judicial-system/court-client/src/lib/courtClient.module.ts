import https, { Agent } from 'https'
import fetch from 'isomorphic-fetch'

import { DynamicModule } from '@nestjs/common'

import {
  AuthenticateApi,
  Configuration,
  CreateCaseApi,
  CreateDocumentApi,
  CreateThingbokApi,
  FetchParams,
  RequestContext,
} from '../../gen/fetch'
import { UploadStreamApi } from './uploadStreamApi'
import {
  CourtClientService,
  CourtClientServiceOptions,
  COURT_CLIENT_SERVICE_OPTIONS,
} from './courtClient.service'

const genApis = [
  AuthenticateApi,
  CreateCaseApi,
  CreateDocumentApi,
  CreateThingbokApi,
]

function injectAgentMiddleware(agent: Agent) {
  return async (context: RequestContext): Promise<FetchParams> => {
    const { url, init } = context

    return { url, init: { ...init, agent } } as FetchParams
  }
}

export interface CourtClientOptions {
  xRoadPath: string
  xRoadClient: string
  clientCert: string
  clientKey: string
  clientCa: string
  serviceOptions: CourtClientServiceOptions
}

export class CourtClientModule {
  static register(options: CourtClientOptions): DynamicModule {
    // Some packages are not available in unit tests
    const agent = https
      ? new https.Agent({
          cert: options.clientCert,
          key: options.clientKey,
          ca: options.clientCa,
          rejectUnauthorized: false,
        })
      : undefined
    const middleware = agent ? [{ pre: injectAgentMiddleware(agent) }] : []
    const defaultHeaders = { 'X-Road-Client': options.xRoadClient }
    const providerConfiguration = new Configuration({
      fetchApi: fetch,
      basePath: options.xRoadPath,
      headers: defaultHeaders,
      middleware,
    })

    return {
      module: CourtClientModule,
      providers: [
        ...genApis.map((api) => ({
          provide: api,
          useFactory: () => new api(providerConfiguration),
        })),
        {
          provide: UploadStreamApi,
          useFactory: () =>
            new UploadStreamApi(options.xRoadPath, defaultHeaders, agent),
        },
        {
          provide: COURT_CLIENT_SERVICE_OPTIONS,
          useValue: options.serviceOptions,
        },
        CourtClientService,
      ],
      exports: [CourtClientService],
    }
  }
}
