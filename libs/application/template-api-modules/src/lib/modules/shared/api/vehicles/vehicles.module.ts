import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { VehiclesService } from './vehicles.service'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'

export class VehiclesModule {
  static register(): DynamicModule {
    return {
      module: VehiclesModule,
      imports: [
        VehiclesClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehiclesClientConfig],
        }),
      ],
      providers: [VehiclesService],
      exports: [VehiclesService],
    }
  }
}
