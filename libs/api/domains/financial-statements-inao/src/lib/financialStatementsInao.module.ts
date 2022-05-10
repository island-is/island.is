import { Module } from '@nestjs/common'
import { FinancialStatementsInaoResolver } from './financialStatementsInao.resolver'

@Module({
  providers: [FinancialStatementsInaoResolver],
})
export class FinancialStatementsInaoModule {}
