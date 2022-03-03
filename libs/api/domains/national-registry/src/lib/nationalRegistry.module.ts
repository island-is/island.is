import { DynamicModule, HttpModule } from '@nestjs/common'

import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'

import { ChildResolver,FamilyMemberResolver, UserResolver } from './graphql'
import { NationalRegistryService } from './nationalRegistry.service'

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
