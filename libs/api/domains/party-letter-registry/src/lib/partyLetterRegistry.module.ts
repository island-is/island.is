import { Module, DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { PartyLetterRegistryResolver } from './partyLetterRegistry.resolver'
import { PartyLetterRegistryService } from './partyLetterRegistry.service'
import { PartyLetterRegistryApi } from '../../gen/fetch/apis'
import { Configuration } from '../../gen/fetch'

export interface Config {
  baseApiUrl: string
}

@Module({})
export class PartyLetterRegistryModule {
  static register(config: Config): DynamicModule {
    return {
      module: PartyLetterRegistryModule,
      providers: [
        PartyLetterRegistryResolver,
        PartyLetterRegistryService,
        {
          provide: PartyLetterRegistryApi,
          useFactory: async () =>
            new PartyLetterRegistryApi(
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
