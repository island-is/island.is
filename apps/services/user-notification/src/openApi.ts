import { DocumentBuilder } from '@nestjs/swagger'
import { UserProfileScope } from '@island.is/auth/scopes'
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
<<<<<<< HEAD
          [UserProfileScope.read]: '',
         
=======
          [UserProfileScope.read]: 'User Profile READ',
>>>>>>> 436e7eeb8a6df349e63f8b358f409d919fd22171
        },
        // authorizationUrl: `${environment.auth.issuer}/connect/authorize`,
        // tokenUrl: `${environment.auth.issuer}/connect/token`,

        authorizationUrl: `https://identity-server.dev01.devland.is/connect/authorize`,
        tokenUrl: `https://identity-server.dev01.devland.is/connect/token`,
      },
    },
  })
  .build()
