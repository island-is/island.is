import { Inject, Module } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { client } from '../../gen/fetch/client.gen'
import { EmploymentCertificateClientConfig } from './employment-certificate.config'
import {
  EMPLOYMENT_CERTIFICATE_CLIENT_OPTIONS,
  getEmploymentCertificateClientOptions,
} from './employment-certificate.options'
import type { EmploymentCertificateClientOptions } from './employment-certificate.options'
import { EmploymentCertificateClientService } from './employment-certificate.service'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [
    {
      provide: EMPLOYMENT_CERTIFICATE_CLIENT_OPTIONS,
      useFactory: getEmploymentCertificateClientOptions,
      inject: [
        EmploymentCertificateClientConfig.KEY,
        XRoadConfig.KEY,
        IdsClientConfig.KEY,
      ],
    },
    EmploymentCertificateClientService,
  ],
  exports: [EmploymentCertificateClientService],
})
export class EmploymentCertificateClientModule {
  constructor(
    @Inject(EMPLOYMENT_CERTIFICATE_CLIENT_OPTIONS)
    options: EmploymentCertificateClientOptions,
  ) {
    client.setConfig({
      // Always set, also when undefined, so no generated default is kept.
      baseUrl: options.baseUrl,
      headers: options.headers,
      fetch: createEnhancedFetch({
        name: 'clients-fjs-employment-certificate',
        organizationSlug: 'fjarsysla-rikisins',
        authSource: 'context',
        timeout: options.timeout,
        // Error bodies are read by getEmploymentCertificateClientProblem
        // instead, so their free-text `error` field is never logged.
        logErrorResponseBody: false,
        autoAuth: options.autoAuth,
      }),
    })
  }
}
