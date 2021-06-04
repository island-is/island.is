import { DocumentBuilder } from '@nestjs/swagger'
import { environment } from './environments'

export const openApi = new DocumentBuilder()
  .setTitle('Temporary voter registry')
  .setDescription('This api contains access to the temporary voter registry.')
  .setVersion('1.0')
  .addTag('temporaryVoterRegistry')
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
