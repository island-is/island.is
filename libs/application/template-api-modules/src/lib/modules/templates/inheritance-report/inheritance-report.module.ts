import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { BaseTemplateAPIModuleConfig } from '../../../types'

import { InheritanceReportTemplateService } from './inheritance-report.service'

export class InheritanceReportTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: InheritanceReportTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        SyslumennClientModule,
      ],
      providers: [InheritanceReportTemplateService],
      exports: [InheritanceReportTemplateService],
    }
  }
}
