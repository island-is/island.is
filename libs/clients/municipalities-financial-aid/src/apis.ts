import { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ApplicationApi,
  FilesApi,
  MunicipalityApi,
  Configuration,
} from '../gen/fetch'
import { MunicipalitiesFinancialAidConfig } from './municipalitiesFinancialAid.config'

export const exportedApis = [ApplicationApi, FilesApi, MunicipalityApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (
      config: ConfigType<typeof MunicipalitiesFinancialAidConfig>,
    ) => {
      return new Api(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: Api.name,
          }),
          basePath: config.baseApiUrl,
        }),
      )
    },
    inject: [MunicipalitiesFinancialAidConfig.KEY],
  }),
)
