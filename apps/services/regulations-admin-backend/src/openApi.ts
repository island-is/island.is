import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Regulations admin - backend')
  .setDescription('Backend services for regulations admin.')
  .setVersion('1.0')
  .addTag('regulations-admin')
  .build()
