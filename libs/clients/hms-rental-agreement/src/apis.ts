import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration, HomeApi } from '../gen/fetch'
import { HmsRentalAgreementClientConfig } from './hmsRentalAgreement.config'

export const exportedApis = [HomeApi].map((Api) => ({
  provide: Api,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HmsRentalAgreementClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-hms-rental-agreement',
          organizationSlug: 'hms',
          timeout: 30000,
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: ['@hms.is/rental-agreements'],
              }
            : undefined,
        }),
        headers: { 'X-Road-Client': xRoadConfig.xRoadClient },
        basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      }),
    )
  },
  inject: [
    XRoadConfig.KEY,
    HmsRentalAgreementClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))
