import { DocumentBuilder } from '@nestjs/swagger'

export const openApi = new DocumentBuilder()
  .setTitle('IdentityServer Public API')
  .setDescription(
    'Public API for IdentityServer.\n\n\nThe swagger document can be downloaded by appending `-json` to the last path segment.',
  )
  .addServer(process.env.PUBLIC_URL ?? 'http://localhost:3370')
  .setVersion('1.0')
  .build()
