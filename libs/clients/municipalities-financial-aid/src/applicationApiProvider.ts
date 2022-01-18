import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { ConfigType } from '@island.is/nest/config'

import {
  ApplicationApi,
  Configuration,
} from '@island.is/clients/municipalities-financial-aid'
import { MunicipalitiesFinancialAidConfig } from './municipalitiesFinancialAid.config'

export const ApplicationApiProvider: Provider<ApplicationApi> = {
  provide: ApplicationApi,
  useFactory: (config: ConfigType<typeof MunicipalitiesFinancialAidConfig>) => {
    return new ApplicationApi(
      new Configuration({
        fetchApi: fetch,
        basePath: config.baseApiUrl,
      }),
    )
  },
  inject: [MunicipalitiesFinancialAidConfig.KEY],
}
