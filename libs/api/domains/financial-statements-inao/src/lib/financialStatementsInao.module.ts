import { DynamicModule } from '@nestjs/common'

import { DataverseClient } from './client/dataverseClient'
import {
  DataverseClientConfig,
  DATAVERSE_CLIENT_CONFIG,
} from './client/dataverseClientConfig'
import { FinancialStatementsInaoResolver } from './financialStatementsInao.resolver'
import { FinancialStatementsInaoService } from './financialStatementsInao.service'

export class FinancialStatementsInaoModule {
  static register(config: DataverseClientConfig): DynamicModule {
    return {
      module: FinancialStatementsInaoModule,
      providers: [
        FinancialStatementsInaoResolver,
        FinancialStatementsInaoService,
        DataverseClient,
        {
          provide: DATAVERSE_CLIENT_CONFIG,
          useValue: config,
        },
      ],
    }
  }
}
