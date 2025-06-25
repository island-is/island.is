import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Payments API')
  .setDescription(
    'This service handles and encapsulates all logic related to payment flows, from creation to payment. It handles communication with FJS for the payments.',
  )
  .setVersion('1.0')
  .addTag('reference')
  .build()
