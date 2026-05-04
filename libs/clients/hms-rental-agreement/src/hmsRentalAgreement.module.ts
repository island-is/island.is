import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { HmsRentalAgreementService } from './hmsRentalAgreement.service'
import { HmsRentalAgreementClientConfig } from './hmsRentalAgreement.config'
import { client } from '../gen/fetch/client.gen'

@Module({
  providers: [HmsRentalAgreementService],
  exports: [HmsRentalAgreementService],
})
export class HmsRentalAgreementClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(HmsRentalAgreementClientConfig.KEY)
    config: ConfigType<typeof HmsRentalAgreementClientConfig>,
  ) {
    client.setConfig({
      baseUrl: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      parseAs: 'json',
      headers: {
        'X-Road-Client': xRoadConfig.xRoadClient,
        Accept: 'application/json',
      },
      responseTransformer: async (data: unknown) => {
        if (typeof data === 'string') {
          try {
            return JSON.parse(data)
          } catch {
            return data
          }
        }
        return data
      },
      fetch: createEnhancedFetch({
        name: 'clients-hms-rental-agreement',
        organizationSlug: 'hms',
        timeout: 30000,
        authSource: 'context',
        autoAuth: {
          mode: 'token',
          issuer: '',
          tokenEndpoint: config.authTokenEndpoint,
          clientId: config.authClientId,
          clientSecret: config.authClientSecret,
          scope: [`api://${config.authClientId}/.default`],
          headerName: 'X-User-Authorization',
        },
      }),
    })
  }
}
