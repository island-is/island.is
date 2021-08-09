import { DynamicModule, Module } from '@nestjs/common'
import {
  PaymentScheduleServiceOptions,
  PaymentScheduleAPI,
} from '@island.is/clients/payment-schedule'
import { PaymentScheduleResolver } from './graphql/payment-schedule.resolver'

@Module({})
export class PaymentScheduleModule {
  static register(config: PaymentScheduleServiceOptions): DynamicModule {
    return {
      module: PaymentScheduleModule,
      providers: [
        PaymentScheduleResolver,
        {
          provide: PaymentScheduleAPI,
          useFactory: () => new PaymentScheduleAPI(config),
        },
      ],
    }
  }
}
