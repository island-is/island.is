import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Flight } from './flight.model'
import {
  PublicFlightController,
  PrivateFlightController,
} from './flight.controller'
import { FlightService } from './flight.service'

@Module({
  imports: [SequelizeModule.forFeature([Flight])],
  controllers: [PublicFlightController, PrivateFlightController],
  providers: [FlightService],
})
export class FlightModule {}
