import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Personal Representative Service API')
  .setDescription(
    'Service API for personal representative. Only intended for the ministry of welfare.\nThe swagger document can be downloaded by appending `-json` to the last path segment.',
  )
  .setVersion('1.0')
  .addBearerAuth()
  .build()
