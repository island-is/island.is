import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('IdentityServer Api')
  .setDescription('Api for IdentityServer.')
  .setVersion('1.0')
  .addTag('auth-api')
  .build()
