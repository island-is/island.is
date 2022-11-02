import { DynamicModule, Module } from '@nestjs/common'
import { BackendAPI } from './services'
import { IcelandicNamesResolver } from './icelandic-names.resolver'

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
        IcelandicNamesResolver,
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
