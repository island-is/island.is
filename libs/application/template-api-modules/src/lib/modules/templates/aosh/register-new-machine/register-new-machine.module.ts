import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { RegisterNewMachineTemplateService } from './register-new-machine.service'
import { ConfigModule } from '@nestjs/config'
import {
  WorkMachinesClientConfig,
  WorkMachinesClientModule,
} from '@island.is/clients/work-machines'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'

export class RegisterNewMachineTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: RegisterNewMachineTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        WorkMachinesClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [WorkMachinesClientConfig, ChargeFjsV2ClientConfig],
        }),
      ],
      providers: [RegisterNewMachineTemplateService],
      exports: [RegisterNewMachineTemplateService],
    }
  }
}
