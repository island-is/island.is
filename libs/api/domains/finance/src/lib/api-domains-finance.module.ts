import { DynamicModule, Module } from '@nestjs/common'
import {
  FinanceService,
  FinanceServiceOptions,
  FINANCE_OPTIONS,
} from '@island.is/clients/finance'
import { FinanceResolver } from './api-domains-finance.resolver'

@Module({})
export class FinanceModule {
  static register(config: FinanceServiceOptions): DynamicModule {
    return {
      module: FinanceModule,
      providers: [
        FinanceResolver,
        {
          provide: FINANCE_OPTIONS,
          useValue: config,
        },
        FinanceService,
      ],
      exports: [FinanceService],
    }
  }
}

export { FinanceService }
