import { DynamicModule, Module } from '@nestjs/common'
import { BackendAPI } from './services'
import { IcelandicNamesResolver } from './icelandic-names.resolver'

export interface Options {
  url: string
}

@Module({})
export class IcelandicNamesModule {
  static register(config: Options): DynamicModule {
    return {
      module: IcelandicNamesModule,
      providers: [IcelandicNamesResolver, BackendAPI],
    }
  }
}
