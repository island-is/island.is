import { Inject, Module } from '@nestjs/common'
import { ElfurClientService } from './elfur.service'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { client } from '../../gen/fetch/client.gen'
import { ElfurClientConfig } from './elfur.config'

@Module({
  providers: [ElfurClientService],
  exports: [ElfurClientService],
})
export class ElfurClientModule {
  constructor(
    @Inject(ElfurClientConfig.KEY)
    config: ConfigType<typeof ElfurClientConfig>,
    @Inject(IdsClientConfig.KEY)
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    client.setConfig({
      fetch: createEnhancedFetch({
        name: 'clients-elfur',
        organizationSlug: 'fjarsysla-rikisins',
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'token',
              issuer: 'https://identity-server.staging01.devland.is',
              clientId: config.clientId,
              clientSecret: config.clientSecret,
              scope:  [
                '@fjs.is/elfur_employee_read',
                '@fjs.is/elfur_organization_read',
                '@fjs.is/elfur_openinvoices_read',
                '@fjs.is/elfur_organization_read',
              ],
            }
          : undefined,
      }),
      baseUrl: config.basePath,
      headers: {
        Accept: 'application/json',
        'X-ExecuteAsUsername': config.apiUsernameKey,
      },
    })
  }
}
