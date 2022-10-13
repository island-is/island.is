import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { DynamicModule } from '@nestjs/common'
import { Base64 } from 'js-base64'

import { TaktikalService } from './taktikal.service'
import { RegisterConfig } from './types/config'
import { Configuration, FlowApi, SigningApi } from '../../gen/fetch'

export class TaktikalModule {
  static register(config: RegisterConfig): DynamicModule {
    const apiConfiguration = {
      provide: 'Taktikal-Configuration',
      useFactory: () => {
        return new Configuration({
          fetchApi: createEnhancedFetch({ name: 'clients-taktikal' }),
          basePath: config.basePath,
          headers: {
            Authorization: `Basic ${Base64.btoa(
              `${config.companyKey}:${config.apiKey}`,
            )}`,
          },
        })
      },
    }

    const apis = [SigningApi, FlowApi].map((Api) => ({
      provide: Api,
      useFactory: (configuration: Configuration) => {
        return new Api(configuration)
      },
      inject: [apiConfiguration.provide],
    }))

    return {
      module: TaktikalModule,
      providers: [TaktikalService, apiConfiguration, ...apis],
      exports: [TaktikalService, ...apis],
    }
  }
}
