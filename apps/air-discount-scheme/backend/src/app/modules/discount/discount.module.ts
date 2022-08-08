import { forwardRef, Module } from '@nestjs/common'

import {
  PrivateDiscountController,
  PublicDiscountController,
} from './discount.controller'
import { DiscountService } from './discount.service'
import { CacheModule } from '../cache'
import { NationalRegistryModule } from '../nationalRegistry'
import { FlightModule } from '../flight'
import { UserModule } from '../user'

@Module({
  imports: [
    CacheModule,
    NationalRegistryModule,
    forwardRef(() => FlightModule),
    UserModule,
  ],
  controllers: [PublicDiscountController, PrivateDiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
