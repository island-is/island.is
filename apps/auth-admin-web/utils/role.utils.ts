import { getSession } from 'next-auth/client'

export class RoleUtils {
  private static readonly adminRoleScope: string = 'auth-admin-api.full_control'

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
        if (scope.includes(this.adminRoleScope)) {
          return true
        }
      }
      return false
    }

    if ((scope as string).includes(this.adminRoleScope)) {
      return true
    }
    return false
  }
}
