import { Module } from '@nestjs/common'

import { PaymentScheduleResolver } from './graphql/payment-schedule.resolver'
import { PaymentScheduleClientModule } from '@island.is/clients/payment-schedule'
import { PaymentScheduleService } from './payment-schedule.service'

@Module({
  imports: [PaymentScheduleClientModule],
  providers: [PaymentScheduleResolver, PaymentScheduleService],
})
export class PaymentScheduleModule {}
