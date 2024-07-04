import { DocumentBuilder } from '@nestjs/swagger'
import { UniversityGatewayScope } from '@island.is/auth/scopes'
import { default as environment } from './environments/environment'

export const openApi = new DocumentBuilder()
  .setTitle('University Gateway')
  .setDescription(
    'API for communication between island.is application system and university gateway DB, and between university gateway DB and universities system (MySchool and Ugla)',
  )
  .setExternalDoc('swagger.json', '/api/swagger-json')
  .addServer(process.env.PUBLIC_URL ?? `http://localhost:${environment.port}`)
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
  .addTag('University Gateway API')
  .build()
