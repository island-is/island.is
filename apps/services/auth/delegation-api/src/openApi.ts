import { DocumentBuilder } from '@nestjs/swagger'
import { environment } from './environments'

export const openApi = new DocumentBuilder()
  .setTitle('IdentityServer Internal Delegation API')
  .setDescription(
    'Internal API for IdentityServer to manage delegations.\n\n\nThe swagger document can be downloaded by appending `-json` to the last path segment.',
  )
  .addServer(process.env.PUBLIC_URL ?? `http://localhost:${environment.port}`)
  .setVersion('1.0')
  .build()
