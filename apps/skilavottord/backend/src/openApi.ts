import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('skilavottord-backend')
  .setDescription('This is the backend for skilavottord.')
  .setVersion('1.0')
  .addTag('skilavottord')
  .build()
