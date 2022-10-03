import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('IdentityServer Admin api')
  .setDescription('Api for administration.')
  .setVersion('1.0')
  .addTag('auth-admin-api')
  .build()
