import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { EnergyFundsService } from './energy-funds.service'
import { ConfigModule } from '@nestjs/config'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import {
  VehicleServiceFjsV1ClientModule,
  VehicleServiceFjsV1ClientConfig,
} from '@island.is/clients/vehicle-service-fjs-v1'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'

export class EnergyFundsModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: EnergyFundsModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        ChargeFjsV2ClientModule,
        VehicleOwnerChangeClientModule,
        VehicleCodetablesClientModule,
        VehicleServiceFjsV1ClientModule,
        VehiclesClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            ChargeFjsV2ClientConfig,
            VehicleOwnerChangeClientConfig,
            VehicleCodetablesClientConfig,
            VehicleServiceFjsV1ClientConfig,
            VehiclesClientConfig,
          ],
        }),
      ],
      providers: [EnergyFundsService],
      exports: [EnergyFundsService],
    }
  }
}
