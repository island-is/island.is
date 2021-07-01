import { DynamicModule, Module } from '@nestjs/common'

import { Register } from '@island.is/infra-nest-server'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'
import { FamilyMemberResolver, UserResolver } from './graphql'
import { NationalRegistryService } from './nationalRegistry.service'

export type Config = NationalRegistryConfig

@Module({})
export class NationalRegistryModule {
  static register({config}: Register<Config, []>): DynamicModule {
    return {
      module: NationalRegistryModule,
      providers: [
        NationalRegistryService,
        UserResolver,
        FamilyMemberResolver,
        {
          provide: NationalRegistryApi,
          useFactory: async () =>
            NationalRegistryApi.instanciateClass(config!),
        },
      ],
      exports: [NationalRegistryService],
    }
  }
}
