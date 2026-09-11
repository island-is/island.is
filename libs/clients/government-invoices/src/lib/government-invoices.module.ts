import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { IdsClientConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { client } from '../../gen/fetch/client.gen'
import { GovernmentInvoicesClientConfig } from './government-invoices.config'
import { GovernmentInvoicesClientService } from './government-invoices.service'

@Module({
  providers: [GovernmentInvoicesClientService],
  exports: [GovernmentInvoicesClientService],
})
export class GovernmentInvoicesClientModule {
  constructor(
    @Inject(GovernmentInvoicesClientConfig.KEY)
    config: ConfigType<typeof GovernmentInvoicesClientConfig>,
    @Inject(IdsClientConfig.KEY)
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    client.setConfig({
      baseUrl: config.basePath,
      headers: {
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-government-invoices',
        organizationSlug: 'fjarsysla-rikisins',
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'token',
              issuer: config.authUrl,
              clientId: config.clientId,
              clientSecret: config.clientSecret,
              scope: [
                '@fjs.is/elfur_employee_read',
                '@fjs.is/elfur_organization_read',
                '@fjs.is/elfur_openinvoices_read',
              ],
            }
          : undefined,
      }),
    })
  }
}
