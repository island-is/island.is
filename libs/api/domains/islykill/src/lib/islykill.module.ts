import { DynamicModule, Module } from '@nestjs/common'

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
      imports: [IslykillApiModule.register(config)],
    }
  }
}
