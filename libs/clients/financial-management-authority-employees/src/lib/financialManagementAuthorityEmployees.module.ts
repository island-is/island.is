import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { client } from '../../gen/fetch/client.gen'
import { FinancialManagementAuthorityEmployeesClientConfig } from './financialManagementAuthorityEmployees.config'
import { FinancialManagementAuthorityEmployeesClientService } from './financialManagementAuthorityEmployees.service'

@Module({
  providers: [FinancialManagementAuthorityEmployeesClientService],
  exports: [FinancialManagementAuthorityEmployeesClientService],
})
export class FinancialManagementAuthorityEmployeesClientModule {
  constructor(
    @Inject(FinancialManagementAuthorityEmployeesClientConfig.KEY)
    config: ConfigType<
      typeof FinancialManagementAuthorityEmployeesClientConfig
    >,
  ) {
    client.setConfig({
      baseUrl: config.basePath,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-ExecuteAsUsername': config.executeAsUsername,
      },
      fetch: createEnhancedFetch({
        name: 'clients-financial-management-authority-employees',
        organizationSlug: 'fjarsysla-rikisins',
        autoAuth: {
          mode: 'token',
          clientId: config.clientId.trim(),
          clientSecret: config.clientSecret.trim(),
          scope: [
            '@fjs.is/elfur_employee_read',
            '@fjs.is/elfur_organization_read',
          ],
          issuer: config.authUrl,
        },
      }),
    })
  }
}
