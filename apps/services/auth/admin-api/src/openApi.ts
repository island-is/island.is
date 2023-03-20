import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('IdentityServer Admin api')
  .setDescription('Api for administration.')
  .setVersion('2.0')
  .addTag('auth-admin-api')
  .build()
