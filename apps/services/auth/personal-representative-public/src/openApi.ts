import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Personal Representative Rights External API')
  .setDescription(
    'Rights API for personal representativve. Intended for selected service providers who do not use island.is agent service.\nThe swagger document can be downloaded by appending `-json` to the last path segment.',
  )
  .setVersion('1.0')
  .addBearerAuth()
  .build()
