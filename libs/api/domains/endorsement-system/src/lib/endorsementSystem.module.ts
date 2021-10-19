import { Module, DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { EndorsementSystemResolver } from './endorsementSystem.resolver'
import { EndorsementSystemService } from './endorsementSystem.service'
import {
  EndorsementApi,
  Configuration,
  EndorsementListApi,
} from '../../gen/fetch'
import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'

export interface Config {
  baseApiUrl: string
  nationalRegistry: NationalRegistryConfig
}
@Module({})
export class EndorsementSystemModule {
  static register(config: Config): DynamicModule {
    return {
      module: EndorsementSystemModule,
      providers: [
        EndorsementSystemResolver,
        EndorsementSystemService,
        {
          provide: EndorsementApi,
          useFactory: async () =>
            new EndorsementApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.baseApiUrl,
              }),
            ),
        },
        {
          provide: EndorsementListApi,
          useFactory: async () =>
            new EndorsementListApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.baseApiUrl,
              }),
            ),
        },
        {
          provide: NationalRegistryApi,
          useFactory: async () =>
            NationalRegistryApi.instanciateClass(config.nationalRegistry),
        },
      ],
      exports: [],
    }
  }
}
