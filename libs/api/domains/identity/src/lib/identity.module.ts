import { Module, DynamicModule } from '@nestjs/common'

import {
  NationalRegistryXRoadConfig,
  NationalRegistryXRoadModule,
} from '@island.is/api/domains/national-registry-x-road'

import { IdentityResolver } from './identity.resolver'
import { IdentityService } from './identity.service'

export type Config = {
  nationalRegistryXRoad: NationalRegistryXRoadConfig
}

@Module({})
export class IdentityModule {
  static register(config: Config): DynamicModule {
    return {
      module: IdentityModule,
      imports: [
        NationalRegistryXRoadModule.register(config.nationalRegistryXRoad),
      ],
      providers: [IdentityResolver, IdentityService],
      exports: [IdentityService],
    }
  }
}
