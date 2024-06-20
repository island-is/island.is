import { DynamicModule } from '@nestjs/common'
import { VMSTModule } from '@island.is/clients/vmst'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { ParentalLeaveService } from './parental-leave.service'
import { SmsModule } from '@island.is/nova-sms'
import { ChildrenService } from './children/children.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import {
  NationalRegistryClientModule,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { APPLICATION_ATTACHMENT_BUCKET } from './constants'

export class ParentalLeaveModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ParentalLeaveModule,
      imports: [
        VMSTModule,
        SharedTemplateAPIModule.register(config),
        SmsModule.register(config.smsOptions),
        ApplicationApiCoreModule,
        NationalRegistryClientModule,
      ],
      providers: [
        ChildrenService,
        ParentalLeaveService,
        NationalRegistryClientService,
        {
          provide: APPLICATION_ATTACHMENT_BUCKET,
          useFactory: () => config.attachmentBucket,
        },
      ],
      exports: [ParentalLeaveService],
    }
  }
}
