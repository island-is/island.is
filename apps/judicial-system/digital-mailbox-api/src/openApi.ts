import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Judicial System xRoad robot API')
  .setDescription('This is the xRoad robot API for the judicial system.')
  .setVersion('1.0')
  .addTag('judicial-system')
  .build()
