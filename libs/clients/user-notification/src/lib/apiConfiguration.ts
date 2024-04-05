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

const generateApiConfiguration = (
  isSystemNotification: boolean,
  idsConfig: ConfigType<typeof IdsClientConfig>,
  config: ConfigType<typeof UserNotificationClientConfig>,
) => {
  return new Configuration({
    fetchApi: createEnhancedFetch({
      name: isSystemNotification
        ? 'clients-system-user-notification'
        : 'clients-user-notification',
      organizationSlug: 'stafraent-island',
      autoAuth:
        !isSystemNotification && idsConfig.isConfigured
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
  })
}

export const UserNotificationApiProvider: Provider<UserNotificationApi> = {
  provide: UserNotificationApi,
  scope: LazyDuringDevScope,
  useFactory: (
    idsConfig: ConfigType<typeof IdsClientConfig>,
    config: ConfigType<typeof UserNotificationClientConfig>,
  ) =>
    new UserNotificationApi(generateApiConfiguration(false, idsConfig, config)),
  inject: [IdsClientConfig.KEY, UserNotificationClientConfig.KEY],
}

export const NotificationsApiProvider: Provider<NotificationsApi> = {
  provide: NotificationsApi,
  scope: LazyDuringDevScope,
  useFactory: (
    idsConfig: ConfigType<typeof IdsClientConfig>,
    config: ConfigType<typeof UserNotificationSystemClientConfig>,
  ) => new NotificationsApi(generateApiConfiguration(true, idsConfig, config)),
  inject: [IdsClientConfig.KEY, UserNotificationSystemClientConfig.KEY],
}
