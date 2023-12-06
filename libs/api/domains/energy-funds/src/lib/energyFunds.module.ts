import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { EnergyFundsService } from './energyFunds.service'

import { EnergyFundsClientModule } from '@island.is/clients/energy-funds'

import { VehiclesClientModule } from '@island.is/clients/vehicles'

@Module({
  imports: [EnergyFundsClientModule, VehiclesClientModule],
  providers: [MainResolver, EnergyFundsService],
  exports: [EnergyFundsService],
})
export class EnergyFundsServiceModule {}
