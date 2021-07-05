import { Module, DynamicModule } from '@nestjs/common'

import { NationalRegistryModule } from '@island.is/api/domains/national-registry'
import { NationalRegistryConfig } from '@island.is/clients/national-registry-v1'

import { IdentityResolver } from './identity.resolver'
import { IdentityService } from './identity.service'

export type Config = {
  nationalRegistry: NationalRegistryConfig
}

@Module({})
export class IdentityModule {
  static register(config: Config): DynamicModule {
    return {
      module: IdentityModule,
      imports: [
        NationalRegistryModule.register({
          nationalRegistry: config.nationalRegistry,
        }),
      ],
      providers: [IdentityResolver, IdentityService],
      exports: [IdentityService],
    }
  }
}
