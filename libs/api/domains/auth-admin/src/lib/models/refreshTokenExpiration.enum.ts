import { registerEnumType } from '@nestjs/graphql'

import { RefreshTokenExpiration } from '@island.is/clients/auth/admin-api'

export { RefreshTokenExpiration } from '@island.is/clients/auth/admin-api'

registerEnumType(RefreshTokenExpiration, {
  name: 'AuthAdminRefreshTokenExpiration',
})
