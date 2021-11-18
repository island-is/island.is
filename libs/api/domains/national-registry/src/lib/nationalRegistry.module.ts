import { DynamicModule, HttpModule } from '@nestjs/common'

import { FamilyMemberResolver, UserResolver } from './graphql'
import { NationalRegistryService } from './nationalRegistry.service'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'

export interface Config {
  nationalRegistry: NationalRegistryConfig
}

export class NationalRegistryModule {
  static register(config: Config): DynamicModule {
    return {
      module: NationalRegistryModule,
      imports: [
        HttpModule.register({
          timeout: 15000,
        }),
      ],
      providers: [
        NationalRegistryService,
        UserResolver,
        FamilyMemberResolver,
        {
          provide: NationalRegistryApi,
          useFactory: async () =>
            NationalRegistryApi.instanciateClass(config.nationalRegistry),
        },
      ],
      exports: [NationalRegistryService],
    }
  }
}
