import { Module } from '@nestjs/common'

import {
  PrivateDiscountController,
  PublicDiscountController,
} from './discount.controller'
import { DiscountService } from './discount.service'
import { CacheModule } from '../cache'
import { NationalRegistryModule } from '../nationalRegistry'

@Module({
  imports: [CacheModule, NationalRegistryModule],
  controllers: [PrivateDiscountController, PublicDiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
