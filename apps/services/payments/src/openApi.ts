import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Payments Microservice')
  .setDescription(
    'This microservice handles API requests for the payments web application.',
  )
  .setVersion('1.0')
  .addTag('reference')
  .build()
