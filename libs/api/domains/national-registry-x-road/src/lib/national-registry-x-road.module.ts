import { DynamicModule, Module } from '@nestjs/common'
import { TjodskraModule } from '@island.is/clients/tjodskra'
import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'

import { NationalRegistryXRoadResolver } from './national-registry-x-road.resolver'
import { NationalRegistryXRoadService } from './national-registry-x-road.service'

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
        TjodskraModule.register({
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
