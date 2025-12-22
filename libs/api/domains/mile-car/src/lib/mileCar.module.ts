import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { MileCarApi } from './mileCar.service'
import { VehiclesClientModule } from '@island.is/clients/vehicles'

@Module({
  imports: [VehiclesClientModule],
  providers: [MainResolver, MileCarApi],
  exports: [MileCarApi],
})
export class MileCarApiModule {}
