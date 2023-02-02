import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('License API')
  .setDescription(`Protected API to update license information`)
  .setVersion('1.0')
  .addTag('license-api')
  .build()
