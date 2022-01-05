import { DynamicModule, Module } from '@nestjs/common'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import {
  IslykillApiModule,
  IslykillApiModuleConfig,
} from '@island.is/clients/islykill'

import { IslykillService } from './islykill.service'

@Module({})
export class IslykillModule {
  static register(config: IslykillApiModuleConfig): DynamicModule {
    return {
      module: IslykillModule,
      providers: [IslykillService],
      imports: [IslykillApiModule.register(config), FeatureFlagModule],
    }
  }
}
