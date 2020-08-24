import { Module } from '@nestjs/common'

import { DiscountResolver } from './discount.resolver'
import { AuthModule } from '../auth'

@Module({
  imports: [AuthModule],
  providers: [DiscountResolver],
})
export class DiscountModule {}
