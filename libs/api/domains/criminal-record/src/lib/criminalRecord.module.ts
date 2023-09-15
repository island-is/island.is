import { Module, DynamicModule } from '@nestjs/common'

import { CriminalRecordService } from './criminalRecord.service'
import {
  CriminalRecordApiModule,
  CriminalRecordApiConfig,
} from '@island.is/clients/criminal-record'

export interface Config {
  clientConfig: CriminalRecordApiConfig
}

@Module({})
export class CriminalRecordModule {
  static register(config: Config): DynamicModule {
    return {
      module: CriminalRecordModule,
      providers: [CriminalRecordService],
      imports: [CriminalRecordApiModule.register(config.clientConfig)],
      exports: [CriminalRecordService],
    }
  }
}
