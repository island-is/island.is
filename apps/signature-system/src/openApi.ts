import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Signature system')
  .setDescription(
    'This API manages non-digital signatures collected by systems within island.is.',
  )
  .setVersion('1.0')
  .addTag('reference')
  .build()
