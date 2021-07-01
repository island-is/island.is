import { Module, DynamicModule } from '@nestjs/common'

import { Register } from '@island.is/infra-nest-server'
import { NationalRegistryModule } from '@island.is/api/domains/national-registry'
import { NationalRegistryConfig } from '@island.is/clients/national-registry-v1'

import { IdentityResolver } from './identity.resolver'
import { IdentityService } from './identity.service'

export type Config = {}

@Module({})
export class IdentityModule {
  static register({modules}: Register<Config, [typeof NationalRegistryModule]>): DynamicModule {
    return {
      module: IdentityModule,
      imports: [
        ...modules!,
      ],
      providers: [IdentityResolver, IdentityService],
      exports: [IdentityService],
    }
  }
}
