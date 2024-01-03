import { Module } from '@nestjs/common'
import { HmsLoansClientService } from './hmsLoans.service'
import { HmsLoansApiProvider } from './hmsLoans.provider'

@Module({
  providers: [HmsLoansApiProvider, HmsLoansClientService],
  exports: [HmsLoansClientService],
})
export class HmsLoansClientModule {}
