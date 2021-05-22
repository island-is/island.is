import { Module, DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { Configuration } from '../../gen/fetch'
import { TemporaryVoterRegistryApi } from '../../gen/fetch/apis/TemporaryVoterRegistryApi'
import { TemporaryVoterRegistryResolver } from './TemporaryVoterRegistry.resolver'
import { TemporaryVoterRegistryService } from './TemporaryVoterRegistry.service'

export interface Config {
  baseApiUrl: string
}

@Module({})
export class TemporaryVoterRegistryModule {
  static register(config: Config): DynamicModule {
    return {
      module: TemporaryVoterRegistryModule,
      providers: [
        TemporaryVoterRegistryResolver,
        TemporaryVoterRegistryService,
        {
          provide: TemporaryVoterRegistryApi,
          useFactory: async () =>
            new TemporaryVoterRegistryApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.baseApiUrl,
              }),
            ),
        },
      ],
      exports: [],
    }
  }
}
