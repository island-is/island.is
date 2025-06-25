import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Judicial System - Mínar Síður API')
  .setDescription('This is the Judicial System API for Mínar Síður.')
  .setVersion('1.0')
  .addTag('judicial-system')
  .build()
