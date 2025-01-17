import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Form System API')
  .setDescription(
    'This is an API for formbuilder and form-rendering (application) system',
  )
  .addServer(process.env.PUBLIC_URL ?? 'http://localhost:3434')
  .setVersion('1.0')
  // .addOAuth2({
  //   type: 'oauth2',
  //   flows: {
  //     authorizationCode: {
  //       authorizationUrl: `${environment.auth.issuer}/connect/authorize`,
  //       tokenUrl: `${environment.auth.issuer}/connect/token`,
  //       scopes: {
  //         ['openid']: '',
  //         ['profile']: '',
  //         [EndorsementsScope.main]: '',
  //         [EndorsementsScope.admin]: '',
  //       },
  //     },
  //   },
  // })
  .build()
