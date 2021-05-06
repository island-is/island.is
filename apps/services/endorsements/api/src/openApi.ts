import { DocumentBuilder } from '@nestjs/swagger'
import { environment } from './environments/environment'

export const openApi = new DocumentBuilder()
  .setTitle('EndorsementSystem')
  .setDescription(
    'This API manages non-digital endorsements collected by systems within island.is.',
  )
  .setVersion('1.0')
  .addOAuth2({
    type: 'oauth2',
    flows: {
      authorizationCode: {
        authorizationUrl: environment.swagger.authUrl,
        tokenUrl: environment.swagger.tokenUrl,
        scopes: {
          'openid profile':
            'Fetches OpenId, Profile and claim needed for authenticated calls',
        },
      },
    },
  })
  .build()
