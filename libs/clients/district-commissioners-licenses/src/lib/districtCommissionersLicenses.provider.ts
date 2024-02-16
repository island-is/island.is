import { Configuration, RettindiFyrirIslandIsApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import { LazyDuringDevScope } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const DistrictCommissionerLicensesApiProvider: Provider<RettindiFyrirIslandIsApi> =
  {
    provide: RettindiFyrirIslandIsApi,
    scope: LazyDuringDevScope,
    useFactory: () =>
      new RettindiFyrirIslandIsApi(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-district-commissioners-licenses',
            organizationSlug: 'syslumenn',
          }),
        }),
      ),
  }
