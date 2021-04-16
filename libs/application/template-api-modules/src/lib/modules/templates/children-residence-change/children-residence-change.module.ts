import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import {
  ChildrenResidenceChangeService,
  PRESIGNED_BUCKET,
} from './children-residence-change.service'
import { SyslumennModule } from '@island.is/api/domains/syslumenn'
import { SharedTemplateAPIModule } from '../../shared'
import { SmsModule } from '@island.is/nova-sms'

export class ChildrenResidenceChangeModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChildrenResidenceChangeModule,
      imports: [
        SyslumennModule.register(config.syslumenn),
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
