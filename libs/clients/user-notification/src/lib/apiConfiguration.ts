import { Provider } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import {
  Configuration,
  NotificationsApi,
  UserNotificationApi,
} from '../../gen/fetch'

import {
  UserNotificationSystemClientConfig,
  UserNotificationClientConfig,
} from './userNotificationClient.config'

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

export const NotificationsApiProvider: Provider<NotificationsApi> = {
  provide: NotificationsApi,
  scope: LazyDuringDevScope,
  useFactory: (
    idsConfig: ConfigType<typeof IdsClientConfig>,
    config: ConfigType<typeof UserNotificationSystemClientConfig>,
  ) =>
    new NotificationsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-system-user-notification',
          organizationSlug: 'stafraent-island',
          // No autoauth since system user notification endpoint is
          // not protected by scope
        }),
        basePath: `${config.basePath}/v1`,
      }),
    ),
  inject: [IdsClientConfig.KEY, UserNotificationSystemClientConfig.KEY],
}
