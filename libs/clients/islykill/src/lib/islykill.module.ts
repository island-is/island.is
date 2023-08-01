import fs from 'fs'
import { DynamicModule } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'

import { Configuration, IslyklarApi } from '../../gen/fetch'

export interface IslykillApiModuleConfig {
  cert: string
  ca: string
  key: string
  passphrase: string
  basePath: string
}

export class IslykillApiModule {
  static register(config: IslykillApiModuleConfig): DynamicModule {
    function lykillError(errorMsg: any) {
      logger.error(errorMsg)
    }

    let cert: Buffer | undefined
    let ca: Buffer | undefined
    let key: Buffer | undefined

    console.log('islykill config', config)
    try {
      if (!config.cert || !config.key) {
        throw Error('IslykillApiModule certificate not provided')
      }

      cert = fs.readFileSync(config.cert)
      ca = fs.readFileSync(config.ca)
      key = fs.readFileSync(config.key)

      console.log('loading islyklar cert and key', { cert, ca, key })
    } catch (err) {
      lykillError(err)
    }

    if (!config.passphrase) {
      //logger.error('IslykillApiModule secret not provided.')
        logger.warn('IslykillApiModule secret not provided. Are you using unsecure private key?')
    }
    const passphrase = config.passphrase

    return {
      module: IslykillApiModule,
      providers: [
        {
          provide: IslyklarApi,
          useFactory: () =>
            new IslyklarApi(
              new Configuration({
                basePath: config.basePath,
                fetchApi: createEnhancedFetch({
                  name: 'clients-islykill',
                  timeout: 20000,
                  clientCertificate: cert && {
                    cert,
                    ca,
                    key,
                    passphrase,
                  },
                  // agentOptions: {
                  //   rejectUnauthorized: false,
                  // }
                }),
              }),
            ),
        },
      ],
      exports: [IslyklarApi],
    }
  }
}
