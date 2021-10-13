import { DynamicModule } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration, OkuskirteiniApi } from '../../gen/fetch'

export class OkuskirteiniApiV1 extends OkuskirteiniApi {}

export const DRIVING_LICENSE_API_VERSION_V1 = '1.0'

export interface DrivingLicenseV1Config {
  xroadBaseUrl: string
  xroadPath: string
  xroadClientId: string
  secret: string
}

const configFactory = (config: DrivingLicenseV1Config) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-driving-license-v1',
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    SECRET: config.secret,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath: `${config.xroadBaseUrl}/${config.xroadPath}`,
})

export class DrivingLicenseApiV1Module {
  static register(config: DrivingLicenseV1Config): DynamicModule {
    return {
      module: DrivingLicenseApiV1Module,
      providers: [
        {
          provide: OkuskirteiniApiV1,
          useFactory: () =>
            new OkuskirteiniApiV1(new Configuration(configFactory(config))),
        },
      ],
      exports: [OkuskirteiniApiV1],
    }
  }
}
