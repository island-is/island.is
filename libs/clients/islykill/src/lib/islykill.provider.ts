import fs from 'fs'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { logger } from '@island.is/logging'
import { ConfigType } from '@island.is/nest/config'

import { Configuration, IslyklarApi } from '../../gen/fetch'
import { IslykillClientConfig } from './islykill.config'

export const IslykillApiModule: Provider<IslyklarApi> = {
  provide: IslyklarApi,
  useFactory: (config: ConfigType<typeof IslykillClientConfig>) => {
    function lykillError(errorMsg: any) {
      logger.error(errorMsg)
    }

    let pfx: Buffer | undefined
    try {
      if (!config.cert) {
        throw Error('IslykillApiModule certificate not provided')
      }
      pfx = fs.readFileSync(config.cert)
    } catch (err) {
      lykillError(err)
    }

    console.log('PFX: PFX: ', pfx?.toString('base64').substr(0, 40))
    if (!config.passphrase) {
      logger.error('IslykillApiModule secret not provided.')
    }
    const passphrase = config.passphrase

    return new IslyklarApi(
      new Configuration({
        basePath: config.basePath,
        fetchApi: createEnhancedFetch({
          name: 'clients-islykill',
          logErrorResponseBody: true,
          timeout: 20000,
          clientCertificate: pfx && {
            pfx,
            passphrase,
          },
        }),
      }),
    )
  },
  inject: [IslykillClientConfig.KEY],
}
