import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Endorsement system')
  .setDescription(
    'This API manages non-digital endorsements collected by systems within island.is.',
  )
  .setVersion('1.0')
  .addTag('user')
  .build()
