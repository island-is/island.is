import { DynamicModule } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration, OkuskirteiniApi } from '../../gen/fetch'

export interface DrivingLicenseConfig {
  xroadBaseUrl: string
  xroadPath: string
  xroadClientId: string
  secret: string
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
                fetchApi: createEnhancedFetch({
                  name: 'clients-driving-license',
                }),
                headers: {
                  'X-Road-Client': config.xroadClientId,
                  SECRET: config.secret,
                  'Content-Type': 'application/json',
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
