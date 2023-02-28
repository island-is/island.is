import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
  FinancialStatementsInaoClientService,
} from '@island.is/clients/financial-statements-inao'

import { FinancialStatementsInaoResolver } from './financialStatementsInao.resolver'
import { FinancialStatementsInaoService } from './financialStatementsInao.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [FinancialStatementsInaoClientConfig],
    }),
    FinancialStatementsInaoClientModule,
  ],
  providers: [
    FinancialStatementsInaoResolver,
    FinancialStatementsInaoService,
    FinancialStatementsInaoClientService,
  ],
  exports: [FinancialStatementsInaoService],
})
export class FinancialStatementsInaoModule {}
