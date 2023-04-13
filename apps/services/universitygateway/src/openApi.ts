import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('title')
  .setDescription('description')
  .setVersion('version')
  .addTag('application')
  .build()