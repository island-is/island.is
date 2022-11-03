import { DynamicModule, Module } from '@nestjs/common'
import { BackendAPI } from './services'
import { AirDiscountSchemeResolver } from './air-discount-scheme.resolver'

import {
  AirDiscountSchemeOptions,
  AIR_DISCOUNT_SCHEME_OPTIONS,
} from '@island.is/air-discount-scheme/types'

@Module({})
export class AirDiscountSchemeModule {
  static register(options: AirDiscountSchemeOptions): DynamicModule {
    return {
      module: AirDiscountSchemeModule,
      providers: [
        AirDiscountSchemeResolver,
        AirDiscountSchemeModule,
        BackendAPI,
        {
          provide: AIR_DISCOUNT_SCHEME_OPTIONS,
          useFactory: () => options,
        },
      ],
    }
  }
}
