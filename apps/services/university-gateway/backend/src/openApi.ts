import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('University Gateway Backend')
  .setDescription('This is the backend for the university gateway.')
  .setVersion('1.0')
  .addTag('university-gateway')
  .build()
