import { DocumentBuilder } from '@nestjs/swagger'
import { UniversityGatewayScope } from '@island.is/auth/scopes'
import { default as environment } from './environments/environment'

export const openApi = new DocumentBuilder()
  .setTitle('University Gateway')
  .setDescription('API description')
  .addServer(process.env.PUBLIC_URL ?? `http://localhost:${environment.port}`)
  // .addBearerAuth()
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
            ['openid']: '',
            ['profile']: '',
            [UniversityGatewayScope.main]: '',
          },
        },
      },
    },
    'ias',
  )
  .setVersion('1.0')
  // .addTag('API tag')
  .build()
