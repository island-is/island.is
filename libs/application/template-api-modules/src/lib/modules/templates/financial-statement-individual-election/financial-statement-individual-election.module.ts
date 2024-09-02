import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'
import { ConfigModule } from '@nestjs/config'
import { FinancialStatementIndividualElectionService } from './financial-statement-individual-election.service'
import { AttachmentS3Service } from '../../shared/services'

export class FinancialStatementIndividualElectionModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FinancialStatementIndividualElectionModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ConfigModule.forRoot({
          load: [FinancialStatementsInaoClientConfig],
        }),
        FinancialStatementsInaoClientModule,
      ],
      providers: [
        FinancialStatementIndividualElectionService,
        AttachmentS3Service,
      ],
      exports: [FinancialStatementIndividualElectionService],
    }
  }
}
