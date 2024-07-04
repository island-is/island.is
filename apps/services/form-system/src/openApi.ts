import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Form System API')
  .setDescription('Formbuilder and form-rendering (application) system')
  .addServer(process.env.PUBLIC_URL ?? 'http://localhost:3000')
  .setVersion('1.0')
  .build()
