import { Module } from '@nestjs/common'
import { HmsLoansClientModule } from '@island.is/clients/hms-loans'
import { HmsLoansResolver } from './api-domains-hms-loans.resolver'

@Module({
  imports: [HmsLoansClientModule],
  providers: [HmsLoansResolver],
})
export class HmsLoansModule {}
