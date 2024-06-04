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
  DocumentsApi,
  GeneralApi,
  IncomePlanApi,
  PaymentPlanApi,
  PensionCalculatorApi,
} from '../../gen/fetch'
import {
  Api,
  ApplicationWriteApi,
  Scope,
} from './socialInsuranceAdministrationClient.type'
import { ConfigFactory } from './configFactory'
import { SocialInsuranceAdministrationClientConfig } from './socialInsuranceAdministrationClient.config'

const apiCollection: Array<{ api: Api; scopes: Array<Scope> }> = [
  {
    api: ApplicationWriteApi,
    scopes: ['@tr.is/umsoknir:write'],
  },
  {
    api: ApplicationApi,
    scopes: ['@tr.is/umsoknir:read'],
  },
  {
    api: ApplicantApi,
    scopes: ['@tr.is/umsaekjandi:read'],
  },
  {
    api: GeneralApi,
    scopes: ['@tr.is/almennt:read'],
  },
  {
    api: DocumentsApi,
    scopes: ['@tr.is/fylgiskjol:write'],
  },
  {
    api: IncomePlanApi,
    scopes: ['@tr.is/tekjuaetlun:read'],
  },
  {
    api: PaymentPlanApi,
    scopes: ['@tr.is/greidsluaetlun:read'],
  },
  {
    api: PensionCalculatorApi,
    scopes: ['@tr.is/stadgreidsla:read'],
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
        ConfigFactory(xroadConfig, config, idsClientConfig, apiRecord.scopes),
      ),
    )
  },
  inject: [
    XRoadConfig.KEY,
    SocialInsuranceAdministrationClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))
