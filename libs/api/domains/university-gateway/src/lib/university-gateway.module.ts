import { DynamicModule, Module } from '@nestjs/common'
import { BackendAPI } from './services'
import { IcelandicNamesResolver } from './icelandic-names.resolver'

import {
  ICELANDIC_NAMES_REGISTRY_OPTIONS,
  IcelandicNamesRegistryOptions,
} from '@island.is/icelandic-names-registry-types'

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
