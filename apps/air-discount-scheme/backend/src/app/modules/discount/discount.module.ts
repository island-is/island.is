import { Module, forwardRef } from '@nestjs/common'

import {
  PublicDiscountController,
  PrivateDiscountController,
} from './discount.controller'
import { DiscountService } from './discount.service'
import { CacheModule } from '../cache'
import { FlightModule } from '../flight'

@Module({
  imports: [forwardRef(() => FlightModule), CacheModule],
  controllers: [PublicDiscountController, PrivateDiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
