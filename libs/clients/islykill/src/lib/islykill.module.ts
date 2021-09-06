import { DynamicModule } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'

import { Configuration, IslyklarApi } from '../../gen/fetch'

export interface IslykillApiModuleConfig {
  certificateBase64: string
  passphrase: string
}

export const ISLYKILL_OPTIONS = 'ISLYKILL_OPTIONS'

export class IslykillApiModule {
  static register(config: IslykillApiModuleConfig): DynamicModule {
    if (!config.certificateBase64) {
      logger.error('IslykillApiModule certificate not provided.')
    }

    if (!config.passphrase) {
      logger.error('IslykillApiModule secret not provided.')
    }

    const pfx = Buffer.from(config.certificateBase64, 'base64')
    const passphrase = config.passphrase

    return {
      module: IslykillApiModule,
      providers: [
        {
          provide: IslyklarApi,
          useFactory: () =>
            new IslyklarApi(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'clients-islykill',
                  certificate: {
                    pfx,
                    passphrase,
                  },
                }),
              }),
            ),
        },
      ],
      exports: [IslyklarApi],
    }
  }
}
