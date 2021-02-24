import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { InstitutionApplicationService } from './institution-application.service'

export class InstitutionApplicationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: InstitutionApplicationModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [InstitutionApplicationService],
      exports: [InstitutionApplicationService],
    }
  }
}
