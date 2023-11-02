import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { DirectorateOfImmigrationClientConfig } from './directorateOfImmigrationClient.config'
import {
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ApplicationAttachmentApi,
  Configuration,
  CountryOfResidenceApi,
  CriminalRecordApi,
  OptionSetApi,
  ResidenceAbroadApi,
  StaticDataApi,
  StudyApi,
  TravelDocumentApi,
} from '../../gen/fetch'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof DirectorateOfImmigrationClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-directorate-of-immigration',
    organizationSlug: 'utlendingastofnun',
    logErrorResponseBody: true,
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'auto',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: config.scope,
        }
      : undefined,
  }),
  headers: {
    'X-Road-Client': xRoadConfig.xRoadClient,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const exportedApis = [
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ApplicationAttachmentApi,
  CountryOfResidenceApi,
  CriminalRecordApi,
  OptionSetApi,
  ResidenceAbroadApi,
  StaticDataApi,
  StudyApi,
  TravelDocumentApi,
].map((Api) => ({
  provide: Api,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof DirectorateOfImmigrationClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Api(
      new Configuration(
        configFactory(
          xRoadConfig,
          config,
          idsClientConfig,
          `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
        ),
      ),
    )
  },
  inject: [
    XRoadConfig.KEY,
    DirectorateOfImmigrationClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))
