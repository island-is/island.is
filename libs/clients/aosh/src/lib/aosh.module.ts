import fs from 'fs'
import { DynamicModule } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'

import { Configuration, AdrApi, VinnuvelaApi } from '../../gen/fetch'

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
        {
          provide: VinnuvelaApi,
          useFactory: () =>
            new VinnuvelaApi(
              new Configuration({
                basePath: config.basePath,
                fetchApi: createEnhancedFetch({
                  name: 'clients-vinnuvela',
                }),
              }),
            ),
        },
      ],
      exports: [AdrApi, VinnuvelaApi],
    }
  }
}
