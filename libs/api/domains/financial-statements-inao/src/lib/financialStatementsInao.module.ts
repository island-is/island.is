import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'

import { FinancialStatementsInaoResolver } from './financialStatementsInao.resolver'
import { FinancialStatementsInaoService } from './financialStatementsInao.service'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
  FinancialStatementsInaoClientService,
} from '@island.is/clients/financial-statements-inao'

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
