import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import {
  ChildrenResidenceChangeService,
  PRESIGNED_BUCKET,
} from './children-residence-change.service'
import { SyslumennModule } from '@island.is/api/domains/syslumenn'

export class ChildrenResidenceChangeModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChildrenResidenceChangeModule,
      imports: [SyslumennModule.register(config.syslumenn)],
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
