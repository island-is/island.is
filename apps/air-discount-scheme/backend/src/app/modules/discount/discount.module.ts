import { forwardRef, Module } from '@nestjs/common'

import { CacheModule } from '../cache'
import { FlightModule } from '../flight'
import { NationalRegistryModule } from '../nationalRegistry'

import { PrivateDiscountController } from './discount.controller'
import { DiscountService } from './discount.service'

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
