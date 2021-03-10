import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import {
  ChildrenResidenceChangeService,
  PRESIGNED_BUCKET,
} from './children-residence-change.service'
import { SyslumennModule } from '@island.is/api/domains/syslumenn'
import { AwsService } from '@island.is/application/file-service'

export class ChildrenResidenceChangeModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChildrenResidenceChangeModule,
      imports: [SyslumennModule.register(config.syslumenn)],
      providers: [
        ChildrenResidenceChangeService,
        {
          provide: PRESIGNED_BUCKET,
          useValue: config.presignBucket,
        },
        AwsService,
      ],
      exports: [ChildrenResidenceChangeService],
    }
  }
}
