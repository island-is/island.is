import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { DrivingLicenseService } from './drivingLicense.service'
import {
  Configuration,
  FetchParams,
  Middleware,
  OkuskirteiniApi,
  RequestContext,
} from '@island.is/clients/driving-license'

interface PathReplacement {
  from: string
  to: string
}

export interface Config {
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

@Module({})
export class DrivingLicenseModule {
  static register(config: Config): DynamicModule {
    return {
      module: DrivingLicenseModule,
      providers: [
        MainResolver,
        DrivingLicenseService,
        {
          provide: OkuskirteiniApi,
          useFactory: async () =>
            new OkuskirteiniApi(
              new Configuration({
                ...(config.replaceInPath
                  ? {
                      middleware: [replacePathMiddleware(config.replaceInPath)],
                    }
                  : {}),
                fetchApi: fetch,
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
      exports: [DrivingLicenseService],
    }
  }
}
