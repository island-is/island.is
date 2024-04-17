import { Provider } from '@nestjs/common'
import {
  Configuration,
  DefaultApi as OfficialJournalApi,
} from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { OfficialJournalClientConfig } from './officialJournalClient.config'
import { ConfigType } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'

export const OfficialJournalApiProvider: Provider<OfficialJournalApi> = {
  provide: OfficialJournalApi,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof OfficialJournalClientConfig>,
  ) => {
    return new OfficialJournalApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-official-journal-public',
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
  inject: [XRoadConfig.KEY, OfficialJournalClientConfig.KEY],
}
