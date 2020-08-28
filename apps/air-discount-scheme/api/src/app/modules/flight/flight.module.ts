import { Module } from '@nestjs/common'

import { FlightResolver } from './flight.resolver'
import { AuthModule } from '../auth'

@Module({
  imports: [AuthModule],
  providers: [FlightResolver],
})
export class FlightModule {}
