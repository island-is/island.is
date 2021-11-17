import { DynamicModule, Module } from '@nestjs/common'

import {
  IslykillApiModule,
  IslykillApiModuleConfig,
} from '@island.is/clients/islykill'

import { MainResolver } from './graphql/main.resolver'
import { IslykillService } from './islykill.service'

@Module({})
export class IslykillModule {
  static register(config: IslykillApiModuleConfig): DynamicModule {
    return {
      module: IslykillModule,
      providers: [MainResolver, IslykillService],
      imports: [IslykillApiModule.register(config)],
    }
  }
}
