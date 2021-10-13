import { DynamicModule } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration, OkuskirteiniApi } from '../../gen/fetch'

export class OkuskirteiniApiV2 extends OkuskirteiniApi {}

export interface DrivingLicenseV2Config {
  xroadBaseUrl: string
  xroadPath: string
  xroadClientId: string
  secret: string
}

export const DRIVING_LICENSE_API_VERSION_V2 = '2.0'

const configFactory = (config: DrivingLicenseV2Config) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-driving-license-v2',
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    SECRET: config.secret,
    'api-version': '2.0',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath: `${config.xroadBaseUrl}/${config.xroadPath}`,
})

export class DrivingLicenseApiV2Module {
  static register(config: DrivingLicenseV2Config): DynamicModule {
    return {
      module: DrivingLicenseApiV2Module,
      providers: [
        {
          provide: OkuskirteiniApiV2,
          useFactory: () =>
            new OkuskirteiniApiV2(new Configuration(configFactory(config))),
        },
      ],
      exports: [OkuskirteiniApiV2],
    }
  }
}
