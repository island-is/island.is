import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { ChildrenResidenceChangeServiceV2 } from './children-residence-change.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { SharedTemplateAPIModule } from '../../shared'
import { SmsModule } from '@island.is/nova-sms'

export class ChildrenResidenceChangeModuleV2 {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChildrenResidenceChangeModuleV2,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
        SmsModule.register(config.smsOptions),
        NationalRegistryClientModule,
      ],
      providers: [ChildrenResidenceChangeServiceV2],
      exports: [ChildrenResidenceChangeServiceV2],
    }
  }
}
