import { Module } from '@nestjs/common'

import { DiscountResolver } from './Discount.resolver'
import { AuthModule } from '../auth'

@Module({
  imports: [AuthModule],
  providers: [DiscountResolver],
})
export class DiscountModule {}
