import { DynamicModule, Module } from '@nestjs/common'
import { NationalRegistryModule } from '@island.is/clients/national-registry-v2'
import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'

import { NationalRegistryXRoadResolver } from './nationalRegistryXRoad.resolver'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'

export interface NationalRegistryXRoadConfig {
  xRoadBasePathWithEnv: string
  xRoadTjodskraMemberCode: string
  xRoadTjodskraApiPath: string
  xRoadClientId: string
}

@Module({})
export class NationalRegistryXRoadModule {
  static register(config: NationalRegistryXRoadConfig): DynamicModule {
    return {
      module: NationalRegistryXRoadModule,
      providers: [
        NationalRegistryXRoadResolver,
        NationalRegistryXRoadService,
        {
          provide: 'Config',
          useFactory: async () => config as NationalRegistryXRoadConfig,
        },
      ],
      imports: [
        NationalRegistryModule.register({
          xRoadPath: createXRoadAPIPath(
            config.xRoadBasePathWithEnv,
            XRoadMemberClass.GovernmentInstitution,
            config.xRoadTjodskraMemberCode,
            config.xRoadTjodskraApiPath,
          ),
          xRoadClient: config.xRoadClientId,
        }),
      ],
      exports: [],
    }
  }
}
