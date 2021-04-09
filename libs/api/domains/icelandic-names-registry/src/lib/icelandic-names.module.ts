import { DynamicModule, Module } from '@nestjs/common'
import { BackendAPI } from './services'
import { IcelandicNamesResolver } from './icelandic-names.resolver'

@Module({})
export class IcelandicNamesModule {
  static register(): DynamicModule {
    return {
      module: IcelandicNamesModule,
      providers: [IcelandicNamesResolver, BackendAPI],
    }
  }
}
