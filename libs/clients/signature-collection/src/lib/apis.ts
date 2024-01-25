import { ConfigType } from '@nestjs/config'
import {
  Configuration,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
  FrambodApi,
} from '../../gen/fetch'
import { SignatureCollectionClientConfig } from './signature-collection.config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export class AdminProcessConfig extends Configuration {}
export class AdminProcessListApi extends MedmaelalistarApi {}
export class AdminProcessCollectionApi extends MedmaelasofnunApi {}
export class AdminProcessSignatureApi extends MedmaeliApi {}
export class AdminProcessCandidateApi extends FrambodApi {}

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
  ...[MedmaelalistarApi, MedmaelasofnunApi, MedmaeliApi, FrambodApi].map(
    (Api) => ({
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
    }),
  ),
  ...[
    AdminProcessListApi,
    AdminProcessCollectionApi,
    AdminProcessSignatureApi,
    AdminProcessCandidateApi,
  ].map((Api) => ({
    provide: Api,
    useFactory: (
      config: ConfigType<typeof SignatureCollectionClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
      xroadConfig: ConfigType<typeof XRoadConfig>,
    ) => {
      return new Api(
        new AdminProcessConfig(
          configFactory(
            config,
            idsClientConfig,
            xroadConfig,
            config.scopeAdminProcess,
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
