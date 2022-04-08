import { DynamicModule, HttpModule } from '@nestjs/common'

import { FamilyMemberResolver, UserResolver, ChildResolver } from './graphql'
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
          timeout: 20000,
        }),
      ],
      providers: [
        NationalRegistryService,
        UserResolver,
        FamilyMemberResolver,
        ChildResolver,
        {
          provide: NationalRegistryApi,
          useFactory: async () =>
            NationalRegistryApi.instantiateClass(config.nationalRegistry),
        },
      ],
      exports: [NationalRegistryService],
    }
  }
}
