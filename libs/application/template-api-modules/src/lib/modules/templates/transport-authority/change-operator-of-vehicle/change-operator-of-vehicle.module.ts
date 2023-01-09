import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ChangeOperatorOfVehicleService } from './change-operator-of-vehicle.service'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'

export class ChangeOperatorOfVehicleModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeOperatorOfVehicleModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        ChargeFjsV2ClientModule,
        VehicleOperatorsClientModule,
        VehicleOwnerChangeClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            ChargeFjsV2ClientConfig,
            VehicleOperatorsClientConfig,
            VehicleOwnerChangeClientConfig,
          ],
        }),
      ],
      providers: [ChangeOperatorOfVehicleService],
      exports: [ChangeOperatorOfVehicleService],
    }
  }
}
