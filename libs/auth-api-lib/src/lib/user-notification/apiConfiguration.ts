import { Provider } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { Configuration, NotificationsApi } from './generated/fetch'

import { DelegationApiUserSystemNotificationConfig } from './user-system-notification.config'

export const NotificationsApiProvider: Provider<NotificationsApi> = {
  provide: NotificationsApi,
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof DelegationApiUserSystemNotificationConfig>,
  ) =>
    new NotificationsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'delegation-api-system-user-notification',
          organizationSlug: 'stafraent-island',
          autoAuth: undefined,
        }),
        basePath: config.isConfigured ? `${config.basePath}` : '',
      }),
    ),
  inject: [DelegationApiUserSystemNotificationConfig.KEY],
}
