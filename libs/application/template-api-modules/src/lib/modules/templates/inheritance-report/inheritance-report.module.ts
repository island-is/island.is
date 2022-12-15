import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { BaseTemplateAPIModuleConfig } from '../../../types'

import { InheritanceReportService } from './inheritance-report.service'

export class InheritanceReportModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: InheritanceReportModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        SyslumennClientModule,
      ],
      providers: [InheritanceReportService],
      exports: [InheritanceReportService],
    }
  }
}
