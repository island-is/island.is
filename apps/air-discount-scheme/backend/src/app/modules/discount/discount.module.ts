import { Module } from '@nestjs/common'

import {
  PublicDiscountController,
  PrivateDiscountController,
} from './discount.controller'
import { DiscountService } from './discount.service'
import { CacheModule } from '../cache'

@Module({
  imports: [CacheModule],
  controllers: [PublicDiscountController, PrivateDiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
