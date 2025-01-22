import fs from 'fs'
import { DynamicModule } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'

import { Configuration, IslyklarApi } from '../../gen/fetch'

export interface IslykillApiModuleConfig {
  cert: string
  passphrase: string
  basePath: string
}

export class IslykillApiModule {
  static register(config: IslykillApiModuleConfig): DynamicModule {
    if (!config.cert) {
      throw new Error('IslykillApiModule certificate not provided')
    }
    if (!config.passphrase) {
      throw new Error('IslykillApiModule passphrase not provided')
    }

    let pfx: Buffer
    try {
      const data = fs.readFileSync(config.cert, { encoding: 'base64' })
      pfx = Buffer.from(data, 'base64')
    } catch (err) {
      throw new Error(`Failed to read certificate: ${err}`)
    }

    const enhancedFetch = createEnhancedFetch({
      name: 'clients-islykill',
      organizationSlug: 'stafraent-island',
      timeout: 20000,
      clientCertificate: { pfx, passphrase: config.passphrase },
    })

    const api = new IslyklarApi(
      new Configuration({
        basePath: config.basePath,
        fetchApi: enhancedFetch,
      }),
    )

    return {
      module: IslykillApiModule,
      providers: [{ provide: IslyklarApi, useFactory: () => api }],
      exports: [IslyklarApi],
    }
  }
}
