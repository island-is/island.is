import { useUserInfo } from '@island.is/react-spa/bff'

/**
 * Custom hook for checking user scopes
 * @param scopes - Array of scopes to check for
 * @returns Object with utility functions for scope checking
 */
export const useUserScopes = (scopes?: string[]) => {
  const user = useUserInfo()
  const userScopes = user?.scopes || []

  return {
    /** All user scopes */
    scopes: userScopes,
    /** Check if user has any of the provided scopes */
    hasAnyScope: (scopesToCheck: string[]) =>
      scopesToCheck.some((scope) => userScopes.includes(scope)),
    /** Check if user has all of the provided scopes */
    hasAllScopes: (scopesToCheck: string[]) =>
      scopesToCheck.every((scope) => userScopes.includes(scope)),
    /** Check if user has a specific scope */
    hasScope: (scope: string) => userScopes.includes(scope),
    /** Check if user has any scopes from the hook initialization */
    hasAnyInitialScope: scopes
      ? scopes.some((scope) => userScopes.includes(scope))
      : false,
    /** User info object */
    user,
    /** Loading state */
    isLoading: !user,
  }
}

export default useUserScopes
