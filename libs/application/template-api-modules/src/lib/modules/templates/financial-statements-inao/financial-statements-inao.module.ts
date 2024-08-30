import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'

import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { FinancialStatementsInaoTemplateService } from './financial-statements-inao.service'
import { AttachmentS3Service } from '../../shared/services'

export class FinancialStatementsInaoTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FinancialStatementsInaoTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ConfigModule.forRoot({
          load: [FinancialStatementsInaoClientConfig],
        }),
        FinancialStatementsInaoClientModule,
        AttachmentS3Service,
      ],
      providers: [FinancialStatementsInaoTemplateService],
      exports: [FinancialStatementsInaoTemplateService],
    }
  }
}
