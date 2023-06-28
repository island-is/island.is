import { useAuth } from '@island.is/auth/react'
import { AdminPortalScope } from '@island.is/auth/scopes'

export const useSuperAdmin = () => {
  const { userInfo } = useAuth()

  const isSuperAdmin = userInfo?.scopes.includes(
    AdminPortalScope.idsAdminSuperUser,
  )

  return {
    isSuperAdmin: isSuperAdmin,
  }
}
