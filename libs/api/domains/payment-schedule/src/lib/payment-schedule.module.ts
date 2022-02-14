import { DynamicModule, Module } from '@nestjs/common'
import {
  PaymentScheduleServiceOptions,
  PaymentScheduleAPI,
} from '@island.is/clients/payment-schedule'
import { PaymentScheduleResolver } from './graphql/payment-schedule.resolver'
import { PaymentScheduleClientModule } from '@island.is/clients/payment-schedule'
import { PaymentScheduleService } from './payment-schedule.service'

@Module({})
export class PaymentScheduleModule {
  static register(config: PaymentScheduleServiceOptions): DynamicModule {
    return {
      module: PaymentScheduleModule,
      imports: [PaymentScheduleClientModule.register(config)],
      providers: [PaymentScheduleResolver, PaymentScheduleService],
    }
  }
}
