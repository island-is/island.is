import { DynamicModule,Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import {
  Configuration,
  EndorsementApi,
  EndorsementListApi,
} from '../../gen/fetch'

import { EndorsementSystemResolver } from './endorsementSystem.resolver'
import { EndorsementSystemService } from './endorsementSystem.service'

export interface Config {
  baseApiUrl: string
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
      ],
      exports: [],
    }
  }
}
