import { DynamicModule } from '@nestjs/common'

import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { SmsModule } from '@island.is/nova-sms'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'

import {
  ChildrenResidenceChangeService,
  PRESIGNED_BUCKET,
} from './children-residence-change.service'

export class ChildrenResidenceChangeModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChildrenResidenceChangeModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
        SmsModule.register(config.smsOptions),
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
