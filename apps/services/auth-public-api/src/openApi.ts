import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('IdentityServer Public Api')
  .setDescription('Public Api for IdentityServer.')
  .setVersion('1.0')
  .addTag('auth-public-api')
  .build()
