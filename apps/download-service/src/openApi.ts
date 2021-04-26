import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Download service api')
  .setDescription('Service for downloading documents.')
  .setVersion('1.0')
  .addTag('documents')
  .build()
