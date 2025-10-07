import { ReactNode } from 'react'
import { useUserInfo } from '@island.is/react-spa/bff'

interface ScopeBasedRenderProps {
  /** Map of scopes to their corresponding components */
  scopeMap: Record<string, ReactNode>
  /** Fallback component to render if no scopes match */
  fallback?: ReactNode
  /** Component to render while user data is loading */
  loading?: ReactNode
  /**
   * Strategy for handling multiple matching scopes
   * - 'first': Render the first matching scope component (default)
   * - 'priority': Use the order in scopeMap as priority (first has highest priority)
   */
  strategy?: 'first' | 'priority'
}

/**
 * A flexible component that renders different child components based on user scopes.
 * This can be used throughout the application for scope-based conditional rendering.
 */
export const ScopeBasedRender = ({
  scopeMap,
  fallback = null,
  loading = null,
  strategy = 'first',
}: ScopeBasedRenderProps) => {
  const user = useUserInfo()

  // Show loading state while user info is being fetched
  if (!user) {
    return loading
  }

  const userScopes = user.scopes || []
  const scopes = Object.keys(scopeMap)

  // Find matching scopes
  const matchingScopes = scopes.filter((scope) => userScopes.includes(scope))

  if (matchingScopes.length === 0) {
    return fallback
  }

  // Handle multiple matches based on strategy
  let selectedScope: string
  if (strategy === 'priority') {
    // First scope in scopeMap has highest priority
    const foundScope = scopes.find((scope) => matchingScopes.includes(scope))
    if (!foundScope) {
      return fallback
    }
    selectedScope = foundScope
  } else {
    // Default: first matching scope
    selectedScope = matchingScopes[0]
  }

  return scopeMap[selectedScope]
}

export default ScopeBasedRender
