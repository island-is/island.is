import { ConfigType } from '@nestjs/config'
import {
  Configuration,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
  FrambodApi,
  AdminApi as AdminClient,
  KosningApi,
} from '../../gen/fetch'
import { SignatureCollectionClientConfig } from './signature-collection.config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export class AdminConfig extends Configuration {}
export class AdminListApi extends MedmaelalistarApi {}
export class AdminCollectionApi extends MedmaelasofnunApi {}
export class AdminSignatureApi extends MedmaeliApi {}
export class AdminCandidateApi extends FrambodApi {}
export class AdminApi extends AdminClient {}

export class ManagerConfig extends Configuration {}
export class ManagerListApi extends MedmaelalistarApi {}
export class ManagerCollectionApi extends MedmaelasofnunApi {}
export class ManagerSignatureApi extends MedmaeliApi {}
export class ManagerCandidateApi extends FrambodApi {}
export class ManagerAdminApi extends AdminClient {}

export class MunicipalityConfig extends Configuration {}
export class MunicipalityListApi extends MedmaelalistarApi {}
export class MunicipalityCollectionApi extends MedmaelasofnunApi {}
export class MunicipalitySignatureApi extends MedmaeliApi {}
export class MunicipalityCandidateApi extends FrambodApi {}
export class MunicipalityAdminApi extends AdminClient {}

const configFactory = (
  config: ConfigType<typeof SignatureCollectionClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  xroadConfig: ConfigType<typeof XRoadConfig>,
  scope: string[],
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-signature-collection',
    organizationSlug: 'thjodskra-islands',
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'auto',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: scope,
        }
      : undefined,
  }),
  basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
  headers: {
    'X-Road-Client': xroadConfig.xRoadClient,
  },
})

export const exportedApis = [
  ...[
    MedmaelalistarApi,
    MedmaelasofnunApi,
    MedmaeliApi,
    FrambodApi,
    KosningApi,
  ].map((Api) => ({
    provide: Api,
    useFactory: (
      config: ConfigType<typeof SignatureCollectionClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
      xroadConfig: ConfigType<typeof XRoadConfig>,
    ) => {
      return new Api(
        new Configuration(
          configFactory(config, idsClientConfig, xroadConfig, config.scope),
        ),
      )
    },
    inject: [
      SignatureCollectionClientConfig.KEY,
      IdsClientConfig.KEY,
      XRoadConfig.KEY,
    ],
  })),
  ...[
    AdminListApi,
    AdminCollectionApi,
    AdminSignatureApi,
    AdminCandidateApi,
    AdminApi,
  ].map((Api) => ({
    provide: Api,
    useFactory: (
      config: ConfigType<typeof SignatureCollectionClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
      xroadConfig: ConfigType<typeof XRoadConfig>,
    ) => {
      return new Api(
        new AdminConfig(
          configFactory(
            config,
            idsClientConfig,
            xroadConfig,
            config.scopeAdmin,
          ),
        ),
      )
    },
    inject: [
      SignatureCollectionClientConfig.KEY,
      IdsClientConfig.KEY,
      XRoadConfig.KEY,
    ],
  })),
  ...[
    ManagerListApi,
    ManagerCollectionApi,
    ManagerSignatureApi,
    ManagerCandidateApi,
    ManagerAdminApi,
  ].map((Api) => ({
    provide: Api,
    useFactory: (
      config: ConfigType<typeof SignatureCollectionClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
      xroadConfig: ConfigType<typeof XRoadConfig>,
    ) => {
      return new Api(
        new ManagerConfig(
          configFactory(
            config,
            idsClientConfig,
            xroadConfig,
            config.scopeManager,
          ),
        ),
      )
    },
    inject: [
      SignatureCollectionClientConfig.KEY,
      IdsClientConfig.KEY,
      XRoadConfig.KEY,
    ],
  })),
  ...[
    MunicipalityListApi,
    MunicipalityCollectionApi,
    MunicipalitySignatureApi,
    MunicipalityCandidateApi,
    MunicipalityAdminApi,
  ].map((Api) => ({
    provide: Api,
    useFactory: (
      config: ConfigType<typeof SignatureCollectionClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
      xroadConfig: ConfigType<typeof XRoadConfig>,
    ) => {
      return new Api(
        new MunicipalityConfig(
          configFactory(
            config,
            idsClientConfig,
            xroadConfig,
            config.scopeMunicipality,
          ),
        ),
      )
    },
    inject: [
      SignatureCollectionClientConfig.KEY,
      IdsClientConfig.KEY,
      XRoadConfig.KEY,
    ],
  })),
]
