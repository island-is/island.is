import { registerEnumType } from '@nestjs/graphql'

import { ClientSso } from '@island.is/clients/auth/admin-api'

// Re-export so models imports from this file to make sure the registerEnumType is called before model references it.
export { ClientSso } from '@island.is/clients/auth/admin-api'

registerEnumType(ClientSso, { name: 'AuthAdminClientSso' })
