import { DocumentBuilder } from '@nestjs/swagger'

import { AuthScope } from '@island.is/auth/scopes'

import { environment } from './environments'

export const openApi = new DocumentBuilder()
  .setTitle('IdentityServer Internal Delegation API')
  .setDescription(
    'Internal API for IdentityServer to manage delegations.\n\n\nThe swagger document can be downloaded by appending `-json` to the last path segment.',
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
            [AuthScope.delegations]: 'Access to manage delegations.',
          },
        },
      },
    },
    'ias',
  )
  .setVersion('1.0')
  .build()
