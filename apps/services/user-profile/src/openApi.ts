import { DocumentBuilder } from '@nestjs/swagger'
import { UserProfileScope } from '@island.is/auth/scopes'
import { environment } from './environments'

export const openApi = new DocumentBuilder()
  .setTitle('User Profile backend')
  .setDescription('Backend providing user profiles for Island.is')
  .setVersion('1.0')
  .addTag('User Profile', 'User profile api for Island.is users ')
  .addOAuth2({
    type: 'oauth2',
    description: 'OAuth2 authentication scheme.',
    flows: {
      authorizationCode: {
        scopes: {
          ['openid']: '',
          ['profile']: '',
          [UserProfileScope.admin]: 'Get user device tokens',
          [UserProfileScope.read]: 'Get a single user profile.',
          [UserProfileScope.write]:
            'Update and email/sms varifications for a single user profile.',
        },
        authorizationUrl: `${environment.auth.issuer}/connect/authorize`,
        tokenUrl: `${environment.auth.issuer}/connect/token`,
      },
    },
  })
  .build()
