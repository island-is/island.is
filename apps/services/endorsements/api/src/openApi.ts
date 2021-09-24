import { GenericScope } from '@island.is/auth/scopes'
import { DocumentBuilder } from '@nestjs/swagger'
import { environment } from './environments'

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
        authorizationUrl: `${environment.auth.issuer}/connect/authorize`,
        tokenUrl: `${environment.auth.issuer}/connect/token`,
        scopes: {
          [`openid profile ${GenericScope.internal}`]: 'Fetches OpenId, Profile and claim needed for authenticated calls',
        },
      },
    },
  })
  .build()
