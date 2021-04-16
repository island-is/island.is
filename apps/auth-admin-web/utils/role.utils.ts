import { getSession } from 'next-auth/client'

export class RoleUtils {
  private static readonly adminRoleScope: Array<string> = [
    'auth-admin-api.full_control',
    '@island.is/auth/admin:root',
    '@island.is/auth/admin:full',
  ]

  public static async isUserAdmin() {
    const session = await getSession()
    if (!session) {
      return false
    }

    const scope = session.scope
    if (!scope) {
      return false
    }

    if (Array.isArray(scope)) {
      if (scope.length > 0) {
        if (scope.some((r) => this.adminRoleScope.includes(r))) {
          return true
        }
      }
      return false
    }

    const scopeArray = (scope as string).split(' ')

    if (scopeArray.some((r) => this.adminRoleScope.includes(r))) {
      return true
    }
    return false
  }
}
