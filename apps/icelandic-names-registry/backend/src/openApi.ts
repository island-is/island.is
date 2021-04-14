import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Íslensk mannanöfn')
  .setVersion('1.0')
  .addBearerAuth()
  .build()
