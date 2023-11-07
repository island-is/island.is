import { Module } from '@nestjs/common'
import { HmsLoansClientService } from './hmsLoans.service'

@Module({
  providers: [HmsLoansClientService],
  exports: [HmsLoansClientService],
})
export class HmsLoansClientModule {}
