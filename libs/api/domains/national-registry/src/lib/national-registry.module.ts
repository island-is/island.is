import { DynamicModule } from '@nestjs/common'
import { NationalRegistryResolver } from './national-registry.resolver'
import { NationalRegistryService } from './national-registry.service'
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
