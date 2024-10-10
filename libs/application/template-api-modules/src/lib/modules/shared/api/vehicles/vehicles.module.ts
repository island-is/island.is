import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { VehiclesService } from './vehicles.service'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'

@Module({
  imports: [
    VehiclesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehiclesClientConfig],
    }),
  ],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
