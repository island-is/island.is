import { Module } from '@nestjs/common'
import { FinanceClientService } from './FinanceClientService'

@Module({
  providers: [FinanceClientService],
  exports: [FinanceClientService],
})
export class FinanceClientModule {}
