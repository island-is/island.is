import { AuthAdminEnvironment } from '@island.is/api/schema'

export const authAdminEnvironments = Object.values(AuthAdminEnvironment).map(
  (env: AuthAdminEnvironment) => env,
)
