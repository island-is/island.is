import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CacheModule } from '../cache'
import { DiscountModule } from '../discount'
import { NationalRegistryModule } from '../nationalRegistry'

import {
  PrivateFlightController,
  PublicFlightController,
} from './flight.controller'
import { Flight, FlightLeg } from './flight.model'
import { FlightService } from './flight.service'

@Module({
  imports: [
    SequelizeModule.forFeature([Flight, FlightLeg]),
    forwardRef(() => DiscountModule),
    NationalRegistryModule,
    CacheModule,
  ],
  controllers: [PublicFlightController, PrivateFlightController],
  providers: [FlightService],
  exports: [FlightService],
})
export class FlightModule {}
