import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Judicial System Backend')
  .setDescription('This is the backend for the judicial system.')
  .setVersion('1.0')
  .addTag('judicial-system')
  .build()
