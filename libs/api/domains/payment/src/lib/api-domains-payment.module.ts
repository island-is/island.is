import { Module } from '@nestjs/common'
import { PaymentResolver } from './api-domains-payment.resolver'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

@Module({
  imports: [ChargeFjsV2ClientModule],
  providers: [PaymentResolver],
})
export class ApiDomainsPaymentModule {}
