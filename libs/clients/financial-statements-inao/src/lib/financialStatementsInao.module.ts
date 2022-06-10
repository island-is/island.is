import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'

import { FinancialStatementsInaoClientConfig } from './financialStatementsInao.config'
import { FinancialStatementsInaoClientService } from './financialStatementsInao.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [FinancialStatementsInaoClientConfig],
    }),
  ],
  providers: [FinancialStatementsInaoClientService],
  exports: [FinancialStatementsInaoClientService],
})
export class FinancialStatementsInaoClientModule {}
