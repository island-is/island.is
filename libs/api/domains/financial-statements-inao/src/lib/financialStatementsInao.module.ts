import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'

import { DataverseClient } from './client/dataverseClient'
import { dataverseClientConfig } from './client/dataverseClient.config'
import { FinancialStatementsInaoResolver } from './financialStatementsInao.resolver'
import { FinancialStatementsInaoService } from './financialStatementsInao.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dataverseClientConfig],
    }),
  ],
  providers: [
    FinancialStatementsInaoResolver,
    FinancialStatementsInaoService,
    DataverseClient,
  ],
})
export class FinancialStatementsInaoModule {}
