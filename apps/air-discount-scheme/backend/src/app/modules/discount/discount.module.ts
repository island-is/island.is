import { forwardRef, Module } from '@nestjs/common'

import { PrivateDiscountController } from './discount.controller'
import { DiscountService } from './discount.service'
import { CacheModule } from '../cache'
import { NationalRegistryModule } from '../nationalRegistry'
import { FlightModule } from '../flight'

@Module({
  imports: [
    CacheModule,
    NationalRegistryModule,
    forwardRef(() => FlightModule),
  ],
  controllers: [PrivateDiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
