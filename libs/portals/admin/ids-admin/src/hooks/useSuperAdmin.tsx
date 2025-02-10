import { AdminPortalScope } from '@island.is/auth/scopes'
import { useUserInfo } from '@island.is/react-spa/bff'

export const useSuperAdmin = () => {
  const userInfo = useUserInfo()

  const isSuperAdmin = userInfo?.scopes.includes(
    AdminPortalScope.idsAdminSuperUser,
  )

  return {
    isSuperAdmin: isSuperAdmin,
  }
}
