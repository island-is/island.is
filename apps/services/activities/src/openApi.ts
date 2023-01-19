import { DocumentBuilder } from '@nestjs/swagger'

import { ActivitiesScope } from '@island.is/auth/scopes'

import { environment } from './environments'

export const openApi = new DocumentBuilder()
  .setTitle('Activity log API')
  .setDescription(
    'Activity log to track user activities.\n\n\nThe swagger document can be downloaded by appending `-json` to the last path segment.',
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
            [ActivitiesScope.activitiesRead]: 'Access to list all activities.',
            [ActivitiesScope.sessionsWrite]:
              'Access to write sessions activities.',
          },
        },
      },
    },
    'ias',
  )
  .setVersion('1.0')
  .build()
