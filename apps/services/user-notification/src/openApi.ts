import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Notification Service')
  .setDescription(
    'Notification service creates and stores notifications AND sends as push notifications and/or email',
  )
  .setVersion('1.0')
  .build()
