import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { PassportService } from './passport.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'

export class PassportModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PassportModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
      ],
      providers: [PassportService],
      exports: [PassportService],
    }
  }
}
