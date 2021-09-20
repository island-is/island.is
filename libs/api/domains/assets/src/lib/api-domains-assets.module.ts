import { DynamicModule, Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AssetsClientModule } from '@island.is/clients/assets'
import { FasteignirApi, Configuration } from '@island.is/clients/assets'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import { AssetsXRoadResolver } from './api-domains-assets.resolver'
import { AssetsXRoadService } from './api-domains-assets.service'

export interface AssetsXRoadConfig {
  xRoadBasePathWithEnv: string
  xRoadAssetsMemberCode: string
  xRoadAssetsApiPath: string
  xRoadClientId: string
}

@Module({})
export class AssetsModule {
  static register(config: AssetsXRoadConfig): DynamicModule {
    return {
      module: AssetsModule,
      providers: [AssetsXRoadResolver, AssetsXRoadService],
      imports: [
        AssetsClientModule.register({
          xRoadClient: config.xRoadClientId,
        }),
        AuthModule,
      ],
      exports: [AssetsXRoadService],
    }
  }
}
