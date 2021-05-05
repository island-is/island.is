import https, { Agent } from 'https'
import fetch from 'isomorphic-fetch'

import { DynamicModule } from '@nestjs/common'

import {
  AuthenticateApi,
  Configuration,
  CreateCaseApi,
  CreateCustodyCaseApi,
  CreateDocumentApi,
  CreateThingbokApi,
  GetCaseSubtypesApi,
  FetchParams,
  OpenApiApi,
  RequestContext,
  SearchBankruptcyHistoryApi,
  UploadStreamApi,
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
  static register(options: CourtClientModuleOptions): DynamicModule {
    const headers = {
      'X-Road-Client': options.xRoadClient,
    }

    const providerConfiguration = new Configuration({
      fetchApi: fetch,
      basePath: options.xRoadPath,
      headers,
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

    const exportedApis = [
      AuthenticateApi,
      CreateCaseApi,
      CreateCustodyCaseApi,
      CreateDocumentApi,
      CreateThingbokApi,
      GetCaseSubtypesApi,
      OpenApiApi,
      SearchBankruptcyHistoryApi,
      UploadStreamApi,
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
