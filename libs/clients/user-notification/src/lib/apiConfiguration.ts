import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'

import {
  Configuration,
  UserNotificationApi,
  NotificationsApi,
} from '../../gen/fetch'
import { UserNotificationClientConfig } from './userNotificationClient.config'

export const exportedApis = [UserNotificationApi, NotificationsApi].map(
  (Api) => ({
    provide: Api,
    scope: LazyDuringDevScope,
    useFactory: (config: ConfigType<typeof UserNotificationClientConfig>) =>
      new Api(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-user-notification',
            organizationSlug: 'stafraent-island',
          }),
          basePath: `${config.basePath}`,
        }),
      ),
    inject: [UserNotificationClientConfig.KEY],
  }),
)
