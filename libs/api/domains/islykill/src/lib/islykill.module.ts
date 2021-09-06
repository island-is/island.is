import { DynamicModule, Module } from '@nestjs/common'

import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  IslykillApiModule,
  IslykillApiModuleConfig,
  ISLYKILL_OPTIONS,
} from '@island.is/clients/islykill'

import { MainResolver } from './graphql/main.resolver'
import { IslykillService } from './islykill.service'

@Module({})
export class IslykillModule {
  static register(config: IslykillApiModuleConfig): DynamicModule {
    return {
      module: IslykillModule,
      providers: [
        MainResolver,
        IslykillService,
        {
          provide: ISLYKILL_OPTIONS,
          useValue: config,
        },
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
      ],
      imports: [IslykillApiModule.register(config)],
    }
  }
}
