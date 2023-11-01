import { DocumentBuilder } from '@nestjs/swagger'
import { NotificationsScope } from '@island.is/auth/scopes'
import { environment } from './environments/environment'

export const openApi = new DocumentBuilder()
  .setTitle('Notification Service')
  .setDescription(
    'Creates and stores notifications AND sends as mobile push notifications and emails',
  )
  .setVersion('1.0')
  .addOAuth2({
    type: 'oauth2',
    description: 'OAuth2 authentication scheme.',
    flows: {
      authorizationCode: {
        scopes: {
          ['openid']: '',
          ['profile']: '',
          [NotificationsScope.read]: '',
          [NotificationsScope.write]: '',
        },
        authorizationUrl: `${environment.auth.issuer}/connect/authorize`,
        tokenUrl: `${environment.auth.issuer}/connect/token`,
      },
    },
  })
  .build()
