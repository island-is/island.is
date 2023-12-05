import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { EnergyFundsApi } from './energyFunds.service'

import {
  EnergyFundsClientModule,
  EnergyFundsClientConfig,
} from '@island.is/clients/energy-funds'

import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'

@Module({
  imports: [
    EnergyFundsClientModule,
    VehiclesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnergyFundsClientConfig, VehiclesClientConfig],
    }),
  ],
  providers: [MainResolver, EnergyFundsApi],
  exports: [EnergyFundsApi],
})
export class EnergyFundsApiModule {}
