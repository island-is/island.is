import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  ApplicantApi,
  ApplicationApi,
  Configuration,
  DeathBenefitsApi,
  DocumentsApi,
  GeneralApi,
  IncomePlanApi,
  MedicalDocumentsApi,
  PaymentPlanApi,
  PensionCalculatorApi,
  QuestionnairesApi,
} from '../../gen/fetch'
import { ConfigFactory } from './configFactory'
import { SocialInsuranceAdministrationClientConfig } from './socialInsuranceAdministrationClient.config'
import {
  Api,
  ApplicationWriteApi,
  MedicalDocumentApiForDisabilityPension,
  QuestionnairesApiForDisabilityPension,
  Scope,
} from './socialInsuranceAdministrationClient.type'

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
    scopes: ['@tr.is/umsoknir:read'],
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
    scopes: ['@tr.is/ororkulifeyrir:read'],
    autoAuth: true,
  },
  {
    api: QuestionnairesApiForDisabilityPension,
    scopes: ['@tr.is/ororkulifeyrir:read'],
    autoAuth: true,
  },
]

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
