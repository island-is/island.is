import { Module } from '@nestjs/common'
import {
  PublicDiscountController,
  PrivateDiscountController,
} from './discount.controller'
import { DiscountService } from './discount.service'

@Module({
  controllers: [PublicDiscountController, PrivateDiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
