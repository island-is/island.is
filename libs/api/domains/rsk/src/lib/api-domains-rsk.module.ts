import { DynamicModule, Module } from '@nestjs/common'
import {
  RSKService,
  RSKServiceOptions,
  RSK_OPTIONS,
} from '@island.is/clients/rsk/v1'
import { RSKResolver } from './api-domains-rsk.resolver'

@Module({})
export class RSKModule {
  static register(config: RSKServiceOptions): DynamicModule {
    return {
      module: RSKModule,
      providers: [
        RSKResolver,
        {
          provide: RSK_OPTIONS,
          useValue: config,
        },
        RSKService,
      ],
    }
  }
}
