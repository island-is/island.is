import { Module } from '@nestjs/common'

import { DiscountResolver } from './discount.resolver'

@Module({
  providers: [DiscountResolver],
})
export class DiscountModule {}
