import { Module } from '@nestjs/common'

import { PrivateDiscountController } from './discount.controller'
import { DiscountService } from './discount.service'
import { CacheModule } from '../cache'
import { NationalRegistryModule } from '../nationalRegistry'

@Module({
  imports: [CacheModule, NationalRegistryModule],
  controllers: [PrivateDiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
