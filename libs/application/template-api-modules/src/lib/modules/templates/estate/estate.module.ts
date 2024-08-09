import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { AwsService } from '@island.is/nest/aws'

import { BaseTemplateAPIModuleConfig } from '../../../types'

import { EstateTemplateService } from './estate.service'

export class EstateTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: EstateTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        SyslumennClientModule,
      ],
      providers: [EstateTemplateService, AwsService],
      exports: [EstateTemplateService],
    }
  }
}
