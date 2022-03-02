import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { ConfigType } from '@island.is/nest/config'

import {
  Configuration,
  FilesApi,
} from '@island.is/clients/municipalities-financial-aid'
import { MunicipalitiesFinancialAidConfig } from './municipalitiesFinancialAid.config'

export const FilesApiProvider: Provider<FilesApi> = {
  provide: FilesApi,
  useFactory: (config: ConfigType<typeof MunicipalitiesFinancialAidConfig>) => {
    return new FilesApi(
      new Configuration({
        fetchApi: fetch,
        basePath: config.baseApiUrl,
      }),
    )
  },
  inject: [MunicipalitiesFinancialAidConfig.KEY],
}
