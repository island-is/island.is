import fs from 'fs'
import { DynamicModule } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'

import { Configuration, AdrApi } from '../../gen/fetch'

export interface AoshApiModuleConfig {
  cert: string
  passphrase: string
  basePath: string
}

export class AoshApiModule {
  static async register(config: AoshApiModuleConfig): Promise<DynamicModule> {
    return {
      module: AoshApiModule,
      providers: [
        {
          provide: AdrApi,
          useFactory: () =>
            new AdrApi(
              new Configuration({
                basePath: config.basePath,
                fetchApi: createEnhancedFetch({
                  name: 'clients-adr',
                }),
              }),
            ),
        },
      ],
      exports: [AdrApi],
    }
  }
}
