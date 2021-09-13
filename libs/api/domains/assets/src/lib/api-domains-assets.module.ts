import { DynamicModule, Module } from '@nestjs/common'
import {
  AssetService,
  AssetServiceOptions,
  ASSET_OPTIONS,
} from '@island.is/clients/assets'
import { AssetsResolver } from './api-domains-assets.resolver'

@Module({})
export class AssetsModule {
  static register(config: AssetServiceOptions): DynamicModule {
    return {
      module: AssetsModule,
      providers: [
        AssetsResolver,
        {
          provide: ASSET_OPTIONS,
          useValue: config,
        },
        AssetService,
      ],
    }
  }
}
