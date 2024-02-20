import { Configuration, RettindiFyrirIslandIsApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const DistrictCommissionerLicensesApiProvider: Provider<RettindiFyrirIslandIsApi> =
  {
    provide: RettindiFyrirIslandIsApi,
    scope: LazyDuringDevScope,
    useFactory: (idsClientConfig: ConfigType<typeof IdsClientConfig>) =>
      new RettindiFyrirIslandIsApi(
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
                  scope: [],
                }
              : undefined,
          }),
        }),
      ),
    inject: [IdsClientConfig.KEY],
  }
