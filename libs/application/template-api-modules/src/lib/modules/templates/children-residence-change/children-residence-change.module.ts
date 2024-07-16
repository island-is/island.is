import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import {ChildrenResidenceChangeService} from './children-residence-change.service'
import {PRESIGNED_BUCKET} from './constants'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { SharedTemplateAPIModule } from '../../shared'
import { SmsModule } from '@island.is/nova-sms'
import { AwsService } from '@island.is/nest/aws'

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
        AwsService,
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
