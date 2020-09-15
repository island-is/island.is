import { Module } from '@nestjs/common'

import { FlightLegResolver } from './flightLeg.resolver'
import { AuthModule } from '../auth'

@Module({
  imports: [AuthModule],
  providers: [FlightLegResolver],
})
export class FlightLegModule {}
