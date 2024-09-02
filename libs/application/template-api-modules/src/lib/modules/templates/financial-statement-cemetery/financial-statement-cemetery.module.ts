import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { ConfigModule } from '@nestjs/config'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'
import { FinancialStatementCemeteryTemplateService } from './financial-statement-cemetery.service'
import { AttachmentS3Service } from '../../shared/services'

export class FinancialStatementCemeteryTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FinancialStatementCemeteryTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ConfigModule.forRoot({
          load: [FinancialStatementsInaoClientConfig],
        }),
        FinancialStatementsInaoClientModule,
      ],
      providers: [
        FinancialStatementCemeteryTemplateService,
        AttachmentS3Service,
      ],
      exports: [FinancialStatementCemeteryTemplateService],
    }
  }
}
