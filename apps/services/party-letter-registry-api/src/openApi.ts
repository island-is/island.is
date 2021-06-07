import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Party letter registry')
  .setDescription('This api manages access to the party letter registry.')
  .setVersion('1.0')
  .addTag('partyLetterRegistry')
  .build()
