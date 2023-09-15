import { DynamicModule } from '@nestjs/common'
import { PassportService } from './passport.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { PassportsClientModule } from '@island.is/clients/passports'

export class PassportModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PassportModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        PassportsClientModule,
      ],
      providers: [PassportService],
      exports: [PassportService],
    }
  }
}
