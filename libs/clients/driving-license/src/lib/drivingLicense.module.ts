import { DynamicModule } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  Configuration,
  FetchParams,
  Middleware,
  OkuskirteiniApi,
  RequestContext,
} from '../../gen/fetch'

interface PathReplacement {
  from: string
  to: string
}

export interface DrivingLicenseConfig {
  xroadBaseUrl: string
  xroadPath: string
  xroadClientId: string
  secret: string
  replaceInPath?: PathReplacement
}

// This is maybe a bit of a hacky fix for the API being different in production
// than it is on dev - apparently this is due for an update
const replacePathMiddleware = ({ from, to }: PathReplacement) => {
  return {
    pre: async (context: RequestContext) => {
      return {
        init: context.init,
        url: context.url.replace(from, to),
      } as FetchParams
    },
  } as Middleware
}

export class DrivingLicenseApiModule {
  static register(config: DrivingLicenseConfig): DynamicModule {
    return {
      module: DrivingLicenseApiModule,
      providers: [
        {
          provide: OkuskirteiniApi,
          useFactory: () =>
            new OkuskirteiniApi(
              new Configuration({
                ...(config.replaceInPath
                  ? {
                      middleware: [replacePathMiddleware(config.replaceInPath)],
                    }
                  : {}),
                fetchApi: createEnhancedFetch({
                  name: 'clients-driving-license',
                }),
                headers: {
                  'X-Road-Client': config.xroadClientId,
                  SECRET: config.secret,
                  'Content-type': 'application/json',
                  Accept: 'application/json',
                },
                basePath: `${config.xroadBaseUrl}/${config.xroadPath}`,
              }),
            ),
        },
      ],
      exports: [OkuskirteiniApi],
    }
  }
}
