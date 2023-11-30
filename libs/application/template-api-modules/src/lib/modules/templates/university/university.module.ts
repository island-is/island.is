import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { UniversityService } from './university.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

export class UniversityModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: UniversityModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        NationalRegistryClientModule,
      ],
      providers: [UniversityService],
      exports: [UniversityService],
    }
  }
}
