import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Financial Aid Backend')
  .setDescription('This is the backend for the financial aid.')
  .setVersion('1.0')
  .addTag('financial-aid')
  .build()
