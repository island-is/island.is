import https, { Agent } from 'https'
import fetch from 'isomorphic-fetch'

import { DynamicModule } from '@nestjs/common'

import {
  AuthenticateApi,
  Configuration,
  CreateCaseApi,
  CreateCustodyCaseApi,
  CreateDocumentApi,
  FetchParams,
  RequestContext,
} from '../../gen/fetch'
import { UploadStreamApi } from './uploadStreamApi'
import {
  CourtClientService,
  COURT_SERVICE_OPTIONS,
} from './court-client.service'

const genApis = [
  AuthenticateApi,
  CreateCaseApi,
  CreateCustodyCaseApi,
  CreateDocumentApi,
]

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
