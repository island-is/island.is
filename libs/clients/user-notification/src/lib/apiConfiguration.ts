import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import { Configuration, UserNotificationApi } from '../../gen/fetch'

import { UserNotificationClientConfig } from './userNotificationClient.config'

export const UserNotificationApiProvider: Provider<UserNotificationApi> = {
  provide: UserNotificationApi,
  scope: LazyDuringDevScope,
  useFactory: (
    idsConfig: ConfigType<typeof IdsClientConfig>,
    config: ConfigType<typeof UserNotificationClientConfig>,
  ) =>
    new UserNotificationApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-user-notification',
          organizationSlug: 'stafraent-island',
          autoAuth: idsConfig.isConfigured
            ? {
                issuer: idsConfig.issuer,
                clientId: idsConfig.clientId,
                clientSecret: idsConfig.clientSecret,
                scope: config.scope,
                mode: 'auto',
              }
            : undefined,
        }),
        basePath: `${config.basePath}/v1`,
      }),
    ),
  inject: [IdsClientConfig.KEY, UserNotificationClientConfig.KEY],
}
