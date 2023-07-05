import { DynamicModule } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import {
  FamilyMemberResolver,
  UserResolver,
  ChildResolver,
  CorrectionResolver,
} from './graphql'
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
        CorrectionResolver,
        {
          provide: NationalRegistryApi,
          // See method doc for disable reason.
          // eslint-disable-next-line local-rules/no-async-module-init
          useFactory: async () =>
            NationalRegistryApi.instantiateClass(config.nationalRegistry),
        },
      ],
      exports: [NationalRegistryService],
    }
  }
}
