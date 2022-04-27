import { Module } from '@nestjs/common'
import { FinancialStatementsInaoResolver } from './financial-statements-inao.resolver'

@Module({
  providers: [FinancialStatementsInaoResolver],
})
export class FinancialStatementsInaoModule {}
