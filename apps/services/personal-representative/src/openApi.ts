import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Personal Representative Service API')
  .setDescription(
    'Service API for personal representativve. Only intended for the minstry of welfare.\nThe swagger document can be downloaded by appending `-json` to the last path segment.',
  )
  .setVersion('1.0')
  .addBearerAuth()
  .build()
