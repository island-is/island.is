import { DocumentBuilder } from '@nestjs/swagger'

import { ApiScope, SessionsScope } from '@island.is/auth/scopes'

import { environment } from './environments/environment'

export const openApi = new DocumentBuilder()
  .setTitle('Session log API')
  .setDescription(
    'Session log to track user sessions.\n\n\nThe swagger document can be downloaded by appending `-json` to the last path segment.',
  )
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
            openid: 'Default openid scope',
            [ApiScope.internal]:
              'Access to list all sessions of the authenticated user.',
            [ApiScope.internalProcuring]:
              'Access to list all sessions of the organisation.',
            [SessionsScope.sessionsWrite]: 'Access to log sessions.',
          },
        },
      },
    },
    'ias',
  )
  .setVersion('1.0')
  .build()
