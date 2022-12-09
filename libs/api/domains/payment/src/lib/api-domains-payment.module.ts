import { Module } from '@nestjs/common'
import { PaymentClientModule } from '@island.is/clients/payment'
import { PaymentResolver } from './api-domains-payment.resolver'

@Module({
  imports: [PaymentClientModule],
  providers: [PaymentResolver],
})
export class ApiDomainsPaymentModule {}
