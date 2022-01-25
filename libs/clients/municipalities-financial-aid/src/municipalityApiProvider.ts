import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { ConfigType } from '@island.is/nest/config'

import { Configuration } from '@island.is/clients/municipalities-financial-aid'
import { MunicipalitiesFinancialAidConfig } from './municipalitiesFinancialAid.config'
import { MunicipalityApi } from '../gen/fetch'

export const MunicipalityApiProvider: Provider<MunicipalityApi> = {
  provide: MunicipalityApi,
  useFactory: (config: ConfigType<typeof MunicipalitiesFinancialAidConfig>) => {
    return new MunicipalityApi(
      new Configuration({
        fetchApi: fetch,
        basePath: config.baseApiUrl,
      }),
    )
  },
  inject: [MunicipalitiesFinancialAidConfig.KEY],
}
