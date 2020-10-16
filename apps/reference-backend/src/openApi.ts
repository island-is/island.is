import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Reference backend')
  .setDescription(
    'This is provided as a reference to implement other backends.',
  )
  .setVersion('1.0')
  .addTag('reference')
  .build()
