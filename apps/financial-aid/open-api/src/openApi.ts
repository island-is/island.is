import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Finanical Aid API')
  .setDescription(
    'This is an API for municipalities to access applications for filing systems',
  )
  .setVersion('1.0')
  .addTag('financial-aid')
  .build()
