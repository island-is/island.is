import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryService } from './national-registry.service'
import { AssetsModule } from '@island.is/api/domains/assets'
import { ConfigModule } from '@nestjs/config'
import { AssetsClientConfig } from '@island.is/clients/assets'

export class NationalRegistryModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: NationalRegistryModule,
      imports: [
        NationalRegistryClientModule,
        AssetsModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [AssetsClientConfig],
        }),
      ],
      providers: [NationalRegistryService],
      exports: [NationalRegistryService],
    }
  }
}
