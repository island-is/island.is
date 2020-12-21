import { DynamicModule } from '@nestjs/common'

import { FamilyMemberResolver, UserResolver } from './graphql'
import { NationalRegistryService } from './nationalRegistry.service'
import { NationalRegistryApi, SoapClient } from './soap'

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
        UserResolver,
        FamilyMemberResolver,
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
