import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Documents backend')
  .setDescription('Backend providing documents and document-providers info')
  .setVersion('1.0')
  .addTag('Document Provider')
  .build()
