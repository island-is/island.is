import { UserProfileScope } from '@island.is/auth/scopes'
import { useUserInfo } from '@island.is/react-spa/bff'

export const useScopeAccess = () => {
  const { scopes } = useUserInfo()

  const hasUserProfileWriteScope = scopes.includes(UserProfileScope.write)

  return { hasUserProfileWriteScope }
}
