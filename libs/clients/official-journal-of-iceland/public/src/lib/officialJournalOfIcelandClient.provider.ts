import { Provider } from '@nestjs/common'
import {
  Configuration,
  DefaultApi as OfficialJournalOfIcelandApi,
} from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { OfficialJournalOfIcelandClientConfig } from './officialJournalOfIcelandClient.config'
import { ConfigType } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'

export const OfficialJournalOfIcelandClientApiProvider: Provider<OfficialJournalOfIcelandApi> =
  {
    provide: OfficialJournalOfIcelandApi,
    useFactory: (
      xroadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof OfficialJournalOfIcelandClientConfig>,
    ) => {
      return new OfficialJournalOfIcelandApi(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-official-journal-of-iceland',
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
    inject: [XRoadConfig.KEY, OfficialJournalOfIcelandClientConfig.KEY],
  }
