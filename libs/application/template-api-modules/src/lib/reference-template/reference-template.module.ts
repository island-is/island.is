import { DynamicModule } from '@nestjs/common'

import { ReferenceTemplateService } from './reference-template.service'

interface ReferenceTemplateModuleConfig {
  sampleConfigProp: string
}

export class ReferenceTemplateModule {
  static register(config: ReferenceTemplateModuleConfig): DynamicModule {
    // access to config.sampleConfigProp injected by module using this module

    return {
      module: ReferenceTemplateModule,
      providers: [ReferenceTemplateService],
      exports: [ReferenceTemplateService],
    }
  }
}
