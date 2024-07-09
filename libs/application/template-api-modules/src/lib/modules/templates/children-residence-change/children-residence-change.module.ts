import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import {
  ChildrenResidenceChangeService,
  PRESIGNED_BUCKET,
} from './children-residence-change.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { SharedTemplateAPIModule } from '../../shared'
import { SmsModule } from '@island.is/nova-sms'

export class ChildrenResidenceChangeModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChildrenResidenceChangeModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
        SmsModule.register(config.smsOptions),
        NationalRegistryClientModule,
      ],
      providers: [
        {
          provide: PRESIGNED_BUCKET,
          useFactory: () => config.presignBucket,
        },
        ChildrenResidenceChangeService,
      ],
      exports: [ChildrenResidenceChangeService],
    }
  }
}
