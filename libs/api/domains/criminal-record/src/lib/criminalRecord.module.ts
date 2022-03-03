import { DynamicModule,Module } from '@nestjs/common'

import {
  CriminalRecordApiConfig,
  CriminalRecordApiModule,
} from '@island.is/clients/criminal-record'

import { CriminalRecordService } from './criminalRecord.service'
import { MainResolver } from './graphql'

export interface Config {
  clientConfig: CriminalRecordApiConfig
}

@Module({})
export class CriminalRecordModule {
  static register(config: Config): DynamicModule {
    return {
      module: CriminalRecordModule,
      providers: [MainResolver, CriminalRecordService],
      imports: [CriminalRecordApiModule.register(config.clientConfig)],
      exports: [CriminalRecordService],
    }
  }
}
