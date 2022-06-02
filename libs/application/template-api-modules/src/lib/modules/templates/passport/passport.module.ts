import { DynamicModule } from '@nestjs/common'
import { PassportService } from './passport.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'

export class PassportModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PassportModule,
      imports: [
        SharedTemplateAPIModule.register(config),
      ],
      providers: [PassportService],
      exports: [PassportService],
    }
  }
}
