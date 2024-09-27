import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../../types'

// Here you import your module service
import { ParliamentaryListCreationService } from './parliamentary-list-creation.service'
import { SignatureCollectionClientModule } from '@island.is/clients/signature-collection'
import {
  NationalRegistryClientModule,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'

export class ParliamentaryListCreationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ParliamentaryListCreationModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        SignatureCollectionClientModule,
        NationalRegistryClientModule,
      ],
      providers: [
        ParliamentaryListCreationService,
        NationalRegistryClientService,
      ],
      exports: [ParliamentaryListCreationService],
    }
  }
}
