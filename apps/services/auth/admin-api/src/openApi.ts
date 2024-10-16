import { DocumentBuilder } from '@nestjs/swagger'
import { environment } from './environments'
import { AuthScope } from '@island.is/auth/scopes'

export const openApi = new DocumentBuilder()
  .setTitle('IdentityServer Admin api')
  .setDescription('Api for administration.')
  .setVersion('2.0')
  .addTag('auth-admin-api')
  .addOAuth2(
    {
      type: 'oauth2',
      description:
        'Authentication and authorization using island.is authentication service (IAS).',
      flows: {
        authorizationCode: {
          authorizationUrl: `${environment.auth.issuer}/connect/authorize`,
          tokenUrl: `${environment.auth.issuer}/connect/token`,
          scopes: {
            openid: 'Default openid scope',
          },
        },
      },
    },
    'ias',
  )
  .build()
