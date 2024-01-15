import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../../types'

// Here you import your module service
import { SignatureListSigningService } from './signature-list-signing.service'
import { SignatureCollectionClientModule } from '@island.is/clients/signature-collection'

export class SignatureListSigningModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: SignatureListSigningModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        SignatureCollectionClientModule,
      ],
      providers: [SignatureListSigningService],
      exports: [SignatureListSigningService],
    }
  }
}
