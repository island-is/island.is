import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { DeregisterMachineTemplateService } from './deregister-machine.service'
import { ConfigModule } from '@nestjs/config'
import {
  WorkMachinesClientConfig,
  WorkMachinesClientModule,
} from '@island.is/clients/work-machines'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'

export class DeregisterMachineTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DeregisterMachineTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        WorkMachinesClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [WorkMachinesClientConfig, ChargeFjsV2ClientConfig],
        }),
      ],
      providers: [DeregisterMachineTemplateService],
      exports: [DeregisterMachineTemplateService],
    }
  }
}
