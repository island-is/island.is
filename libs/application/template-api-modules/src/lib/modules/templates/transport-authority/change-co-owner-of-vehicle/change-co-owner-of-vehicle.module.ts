import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ChangeCoOwnerOfVehicleService } from './change-co-owner-of-vehicle.service'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import {
  VehicleServiceFjsV1ClientModule,
  VehicleServiceFjsV1ClientConfig,
} from '@island.is/clients/vehicle-service-fjs-v1'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'

export class ChangeCoOwnerOfVehicleModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeCoOwnerOfVehicleModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehicleOwnerChangeClientModule,
        VehicleOperatorsClientModule,
        VehicleCodetablesClientModule,
        ChargeFjsV2ClientModule,
        VehicleServiceFjsV1ClientModule,
        VehiclesClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            VehicleOwnerChangeClientConfig,
            VehicleOperatorsClientConfig,
            VehicleCodetablesClientConfig,
            ChargeFjsV2ClientConfig,
            VehicleServiceFjsV1ClientConfig,
            VehiclesClientConfig,
          ],
        }),
      ],
      providers: [ChangeCoOwnerOfVehicleService],
      exports: [ChangeCoOwnerOfVehicleService],
    }
  }
}
