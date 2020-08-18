import { Module } from '@nestjs/common'
import {
  PublicDiscountController,
  PrivateDiscountController,
} from './discount.controller'
import { DiscountService } from './discount.service'
import { FlightModule } from '../flight/flight.module'

@Module({
  imports: [FlightModule],
  controllers: [PublicDiscountController, PrivateDiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
