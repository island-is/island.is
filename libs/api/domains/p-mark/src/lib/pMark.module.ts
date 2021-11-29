import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { PMarkService } from './pMark.service'
import { PMarkApiModule, PMarkApiConfig } from '@island.is/clients/p-mark'

export interface Config {
  clientConfig: PMarkApiConfig
}

@Module({})
export class PMarkModule {
  static register(config: Config): DynamicModule {
    return {
      module: PMarkModule,
      providers: [MainResolver, PMarkService],
      imports: [PMarkApiModule.register(config.clientConfig)],
      exports: [PMarkService],
    }
  }
}
