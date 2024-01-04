import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ApplicationApi,
  FilesApi,
  MunicipalityApi,
  Configuration,
  PersonalTaxReturnApi,
} from '../../gen/fetch'
import { MunicipalitiesFinancialAidConfig } from './municipalitiesFinancialAid.config'

export const exportedApis = [
  ApplicationApi,
  FilesApi,
  MunicipalityApi,
  PersonalTaxReturnApi,
].map((Api) => ({
  provide: Api,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof MunicipalitiesFinancialAidConfig>,
  ) => {
    return new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: Api.name,
        }),
        // headers: { 'X-Road-Client': xRoadConfig.xRoadClient },
        basePath: `http://localhost:3344`,
      }),
    )
  },
  inject: [XRoadConfig.KEY, MunicipalitiesFinancialAidConfig.KEY],
}))
