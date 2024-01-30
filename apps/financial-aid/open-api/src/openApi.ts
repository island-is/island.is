import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Finanical Aid API')
  .setDescription('This is the API for the financial aid.')
  .setVersion('1.0')
  .addTag('financial-aid')
  .build()
