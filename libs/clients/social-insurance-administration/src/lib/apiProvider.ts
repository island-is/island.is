import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { ConfigFactory } from './configFactory'
import {
  Api,
  ApplicationWriteApi,
  MedicalDocumentApiForDisabilityPension,
  QuestionnairesApiForDisabilityPension,
  Scope,
} from './socialInsuranceAdministrationClient.type'
import {
  ApplicationApi,
  ApplicantApi,
  GeneralApi,
  DocumentsApi,
  IncomePlanApi,
  PaymentPlanApi,
  PensionCalculatorApi,
  DeathBenefitsApi,
  MedicalDocumentsApi,
  QuestionnairesApi,
  Configuration,
} from '../../gen/fetch/v1'
import {
  ApplicationApi as ApplicationWriteApiV2,
  Configuration as ConfigurationV2,
} from '../../gen/fetch/v2'
import { Provider } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { SocialInsuranceAdministrationClientConfig } from './config/socialInsuranceAdministrationClient.config'
import { SocialInsuranceAdministrationClientConfigV2 } from './config/socialInsuranceAdministrationClientV2.config'

const apiCollection: Array<{
  api: Api
  scopes: Array<Scope>
  autoAuth: boolean
}> = [
  {
    api: ApplicationWriteApi,
    scopes: ['@tr.is/umsoknir:write'],
    autoAuth: true,
  },
  {
    api: ApplicationApi,
    scopes: ['@tr.is/umsoknir:read', '@tr.is/fylgiskjol:write'],
    autoAuth: true,
  },
  {
    api: ApplicantApi,
    scopes: ['@tr.is/umsaekjandi:read'],
    autoAuth: true,
  },
  {
    api: GeneralApi,
    scopes: ['@tr.is/almennt:read'],
    autoAuth: true,
  },
  {
    api: DocumentsApi,
    scopes: ['@tr.is/fylgiskjol:write'],
    autoAuth: true,
  },
  {
    api: IncomePlanApi,
    scopes: ['@tr.is/tekjuaetlun:read', '@tr.is/stadgreidsla:read'],
    autoAuth: true,
  },
  {
    api: PaymentPlanApi,
    scopes: ['@tr.is/greidsluaetlun:read'],
    autoAuth: true,
  },
  {
    api: PensionCalculatorApi,
    scopes: ['@tr.is/stadgreidsla:read'],
    autoAuth: false,
  },
  {
    api: DeathBenefitsApi,
    scopes: ['@tr.is/danarbaetur:read'],
    autoAuth: true,
  },
  {
    api: MedicalDocumentsApi,
    scopes: ['@tr.is/sjukraogendurhaefingargreidslur:read'],
    autoAuth: true,
  },
  {
    api: QuestionnairesApi,
    scopes: ['@tr.is/sjukraogendurhaefingargreidslur:read'],
    autoAuth: true,
  },
  {
    api: MedicalDocumentApiForDisabilityPension,
    scopes: ['@tr.is/ororkulifeyrir:read', '@tr.is/umsoknir:read'],
    autoAuth: true,
  },
  {
    api: QuestionnairesApiForDisabilityPension,
    scopes: ['@tr.is/ororkulifeyrir:read', '@tr.is/umsoknir:read'],
    autoAuth: true,
  },
]

export const ApplicationV2ApiProvider: Provider<ApplicationWriteApiV2> = {
  provide: ApplicationWriteApiV2,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof SocialInsuranceAdministrationClientConfigV2>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new ApplicationWriteApiV2(
      new ConfigurationV2({
        fetchApi: createEnhancedFetch({
          name: 'clients-tr',
          organizationSlug: 'tryggingastofnun',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: ['@tr.is/umsoknir:write'],
              }
            : undefined,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
        },
      }),
    ),
  inject: [
    XRoadConfig.KEY,
    SocialInsuranceAdministrationClientConfigV2.KEY,
    IdsClientConfig.KEY,
  ],
}

export const apiProvider = apiCollection.map((apiRecord) => ({
  provide: apiRecord.api,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof SocialInsuranceAdministrationClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new apiRecord.api(
      new Configuration(
        ConfigFactory(
          xroadConfig,
          config,
          idsClientConfig,
          apiRecord.scopes,
          apiRecord.autoAuth,
        ),
      ),
    )
  },
  inject: [
    XRoadConfig.KEY,
    SocialInsuranceAdministrationClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))
