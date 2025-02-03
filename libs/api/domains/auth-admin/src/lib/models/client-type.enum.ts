import { registerEnumType } from '@nestjs/graphql'

import { ClientType, CreateClientType } from '@island.is/clients/auth/admin-api'

// Re-export so models imports from this file to make sure the registerEnumType is called before model references it.
export { ClientType } from '@island.is/clients/auth/admin-api'
export { CreateClientType } from '@island.is/clients/auth/admin-api'

registerEnumType(ClientType, { name: 'AuthAdminClientType' })
registerEnumType(CreateClientType, { name: 'AuthAdminCreateClientType' })
