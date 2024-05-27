import { Configuration, RettindiFyrirIslandIs2Api } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { DistrictCommissionersLicensesClientConfig } from './districtCommissionersLicenses.config'

export const DistrictCommissionerLicensesApiProvider2: Provider<RettindiFyrirIslandIs2Api> =
  {
    provide: RettindiFyrirIslandIs2Api,
    scope: LazyDuringDevScope,
    useFactory: (
      xroadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof DistrictCommissionersLicensesClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) =>
      new RettindiFyrirIslandIs2Api(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-district-commissioners-licenses',
            organizationSlug: 'syslumenn',
            autoAuth: idsClientConfig.isConfigured
              ? {
                  mode: 'tokenExchange',
                  issuer: idsClientConfig.issuer,
                  clientId: idsClientConfig.clientId,
                  clientSecret: idsClientConfig.clientSecret,
                  scope: config.scope,
                }
              : undefined,
          }),
          basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
          headers: {
            'X-Road-Client': xroadConfig.xRoadClient,
            Accept: 'application/json',
          },
        }),
      ),
    inject: [
      XRoadConfig.KEY,
      DistrictCommissionersLicensesClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  }
