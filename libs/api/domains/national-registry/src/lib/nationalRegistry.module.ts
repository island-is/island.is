import { DynamicModule } from '@nestjs/common'

import { NationalRegistryResolver } from './nationalRegistry.resolver'
import { NationalRegistryService } from './nationalRegistry.service'
import { NationalRegistryApi } from './soap/nationalRegistryApi'
import { SoapClient } from './soap/soapClient'

export interface Config {
  baseSoapUrl: string
  host: string
  user: string
  password: string
}

export class NationalRegistryModule {
  static register(config: Config): DynamicModule {
    return {
      module: NationalRegistryModule,
      providers: [
        NationalRegistryService,
        NationalRegistryResolver,
        {
          provide: NationalRegistryApi,
          useFactory: async () =>
            new NationalRegistryApi(
              await SoapClient.generateClient(config.baseSoapUrl, config.host),
              config.password,
              config.user,
            ),
        },
      ],
      exports: [],
    }
  }
}
