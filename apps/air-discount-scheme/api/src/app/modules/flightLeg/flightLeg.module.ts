import { Module } from '@nestjs/common'

import { FlightLegResolver } from './flightLeg.resolver'

@Module({
  providers: [FlightLegResolver],
})
export class FlightLegModule {}
