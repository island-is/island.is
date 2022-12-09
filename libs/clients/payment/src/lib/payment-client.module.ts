import { Module } from '@nestjs/common'
import { PaymentAPI } from './payment-clientApi'

@Module({
  providers: [PaymentAPI],
  exports: [PaymentAPI],
})
export class PaymentClientModule {}
