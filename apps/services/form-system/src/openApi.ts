import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Form System API')
  .setDescription(
    'This is an API for formbuilder and form-rendering (application) system',
  )
  .addServer(process.env.PUBLIC_URL ?? 'http://localhost:3434')
  .setVersion('1.0')
  .build()
