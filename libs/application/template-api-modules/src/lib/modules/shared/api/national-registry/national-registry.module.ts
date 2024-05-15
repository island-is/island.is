import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryService } from './national-registry.service'
import { AssetsModule } from '@island.is/api/domains/assets'
import { ConfigModule } from '@nestjs/config'
import { AssetsClientConfig } from '@island.is/clients/assets'
import {
  NationalRegistryV3ClientModule,
  NationalRegistryV3ClientConfig,
} from '@island.is/clients/national-registry-v3'

export class NationalRegistryModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: NationalRegistryModule,
      imports: [
        NationalRegistryClientModule,
        NationalRegistryV3ClientModule,
        AssetsModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [AssetsClientConfig, NationalRegistryV3ClientConfig],
        }),
      ],
      providers: [NationalRegistryService],
      exports: [NationalRegistryService],
    }
  }
}
