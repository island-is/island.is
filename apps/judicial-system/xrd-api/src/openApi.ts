import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Judicial System xRoad API')
  .setDescription('This is the xRoad API for the judicial system.')
  .setVersion('1.0')
  .addTag('judicial-system')
  .build()
