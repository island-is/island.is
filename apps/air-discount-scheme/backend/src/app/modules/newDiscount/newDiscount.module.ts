import { forwardRef, Module } from '@nestjs/common'

import {
  PrivateNewDiscountAdminController,
  PrivateNewDiscountController,
  PublicNewDiscountController,
} from './newDiscount.controller'
import { NewDiscountService } from './newDiscount.service'
import { NationalRegistryModule } from '../nationalRegistry'
import { FlightModule } from '../flight'
import { UserModule } from '../user'
import {NewDiscount, AirDiscount, DiscountedFlight, DiscountedFlightLeg} from './newDiscount.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [
    SequelizeModule.forFeature([NewDiscount]),
    SequelizeModule.forFeature([AirDiscount]),
    SequelizeModule.forFeature([DiscountedFlight]),
    SequelizeModule.forFeature([DiscountedFlightLeg]),
    NationalRegistryModule,
    forwardRef(() => FlightModule),
    UserModule,
  ],
  controllers: [
    PublicNewDiscountController,
    PrivateNewDiscountController,
    PrivateNewDiscountAdminController,
  ],
  providers: [NewDiscountService],
  exports: [NewDiscountService],
})
export class NewDiscountModule {}
