import { DynamicModule, Module } from '@nestjs/common'
import {
  RegulationsService,
  RegulationsServiceOptions,
  REGULATIONS_OPTIONS,
} from '@island.is/clients/regulations'
import { RegulationsResolver } from './api-domains-regulations.resolver'

@Module({})
export class RegulationsModule {
  static register(config: RegulationsServiceOptions): DynamicModule {
    return {
      module: RegulationsModule,
      providers: [
        RegulationsResolver,
        {
          provide: REGULATIONS_OPTIONS,
          useValue: config,
        },
        RegulationsService,
      ],
    }
  }
}
