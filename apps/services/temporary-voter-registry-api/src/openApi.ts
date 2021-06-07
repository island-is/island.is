import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('Temporary voter registry')
  .setDescription('This api contains access to the temporary voter registry.')
  .setVersion('1.0')
  .addTag('temporaryVoterRegistry')
  .build()
