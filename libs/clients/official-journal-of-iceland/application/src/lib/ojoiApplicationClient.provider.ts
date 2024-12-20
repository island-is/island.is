import { Provider } from '@nestjs/common'
import {
  Configuration,
  DefaultApi as OfficialJournalOfIcelandApplicationApi,
} from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { OfficialJournalOfIcelandApplicationClientConfig } from './ojoiApplicationClient.config'
import { ConfigType } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'

export const OfficialJournalOfIcelandApplicationClientApiProvider: Provider<OfficialJournalOfIcelandApplicationApi> =
  {
    provide: OfficialJournalOfIcelandApplicationApi,
    useFactory: (
      xroadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<
        typeof OfficialJournalOfIcelandApplicationClientConfig
      >,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new OfficialJournalOfIcelandApplicationApi(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-official-journal-of-iceland-application',
            autoAuth: idsClientConfig.isConfigured
              ? {
                  mode: 'tokenExchange',
                  issuer: idsClientConfig.issuer,
                  clientId: idsClientConfig.clientId,
                  clientSecret: idsClientConfig.clientSecret,
                  scope: config.scope,
                }
              : undefined,
            organizationSlug: 'domsmalaraduneytid',
          }),
          basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
          headers: {
            'X-Road-Client': xroadConfig.xRoadClient,
            Accept: 'application/json',
          },
        }),
      )
    },
    inject: [
      XRoadConfig.KEY,
      OfficialJournalOfIcelandApplicationClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  }
