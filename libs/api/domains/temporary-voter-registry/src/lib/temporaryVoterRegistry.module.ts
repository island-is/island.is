import { Module, DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { TemporaryVoterRegistryResolver } from './temporaryVoterRegistry.resolver'
import { TemporaryVoterRegistryService } from './temporaryVoterRegistry.service'
import { TemporaryVoterRegistryApi } from '../../gen/fetch/apis/temporaryVoterRegistryApi'
import { Configuration } from '../../gen/fetch'

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
