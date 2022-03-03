import { DynamicModule, Module } from '@nestjs/common'

import {
  ICELANDIC_NAMES_REGISTRY_OPTIONS,
  IcelandicNamesRegistryOptions,
} from '@island.is/icelandic-names-registry-types'

import { IcelandicNamesResolver } from './icelandic-names.resolver'
import { BackendAPI } from './services'

@Module({})
export class IcelandicNamesModule {
  static register(options: IcelandicNamesRegistryOptions): DynamicModule {
    return {
      module: IcelandicNamesModule,
      providers: [
        IcelandicNamesResolver,
        IcelandicNamesModule,
        BackendAPI,
        {
          provide: ICELANDIC_NAMES_REGISTRY_OPTIONS,
          useFactory: () => options,
        },
      ],
    }
  }
}
