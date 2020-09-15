import { Module } from '@nestjs/common'

import { FlightResolver } from './flight.resolver'

@Module({
  providers: [FlightResolver],
})
export class FlightModule {}
