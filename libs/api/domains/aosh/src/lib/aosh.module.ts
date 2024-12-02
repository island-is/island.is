import { Module } from '@nestjs/common'
// import { MainResolver } from './graphql/main.resolver'
import { AoshService } from './aosh.service'

// import { AoshClientModule } from '@island.is/clients/energy-funds'

import { VehiclesClientModule } from '@island.is/clients/vehicles'

@Module({
  imports: [VehiclesClientModule], //AoshClientModule
  providers: [AoshService], //MainResolver
  exports: [AoshService],
})
export class AoshServiceModule {}
