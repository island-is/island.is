import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { TransferOfVehicleOwnershipService } from './transfer-of-vehicle-ownership.service'
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

export class TransferOfVehicleOwnershipModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TransferOfVehicleOwnershipModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        ChargeFjsV2ClientModule,
        VehicleOwnerChangeClientModule,
        VehicleCodetablesClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            ChargeFjsV2ClientConfig,
            VehicleOwnerChangeClientConfig,
            VehicleCodetablesClientConfig,
          ],
        }),
      ],
      providers: [TransferOfVehicleOwnershipService],
      exports: [TransferOfVehicleOwnershipService],
    }
  }
}
