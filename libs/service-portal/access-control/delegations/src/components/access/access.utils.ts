import { AuthApiScopeGroup } from '@island.is/api/schema'
import {
  GROUP_PREFIX,
  Scope,
  SCOPE_PREFIX,
  AuthScopeTree,
  AUTH_API_SCOPE_GROUP_TYPE,
  ScopeGroup,
  AccessFormScope,
  MappedScope,
} from './access.types'

/**
 * Checks if scope is a scope group type
 */
export const isApiScopeGroup = (scope: Scope): scope is ScopeGroup =>
  scope.__typename === AUTH_API_SCOPE_GROUP_TYPE

/**
 * Flattens out scope group into a list of scopes and extends each scope with model property for form state
 * @param apiScopeGroup Scope group to flatten
 * @param startIndex Index to create unique key for form
 */
export const flattenAndExtendApiScopeGroup = (
  apiScopeGroup: AuthApiScopeGroup,
  startIndex: number,
): Scope[] => [
  // Scope parent of the children
  {
    ...apiScopeGroup,
    model: `${GROUP_PREFIX}.${startIndex}`,
  },
  // Scope children
  ...(apiScopeGroup.children?.map((scope, childIndex) => ({
    ...scope,
    model: `${SCOPE_PREFIX}.${startIndex + childIndex}`,
  })) || []),
]

/**
 * Extends scope with model property for form state
 * @param apiScope current scope
 * @param index current scope index in list
 * @param authScopes list of scopes
 */
export const extendApiScope = (
  apiScope: AuthScopeTree[0],
  index: number,
  authScopes: AuthScopeTree,
): Scope => {
  const previousScope = authScopes[index - 1]
  let modelIndex = index

  if (
    previousScope &&
    previousScope.__typename === AUTH_API_SCOPE_GROUP_TYPE &&
    previousScope.children?.[0]
  ) {
    modelIndex = previousScope.children.length - 1 + index
  }

  return {
    ...apiScope,
    model: `${SCOPE_PREFIX}.${modelIndex}`,
  }
}

type MapScopeTreeToScope = {
  item: AccessFormScope
  authScopeTree?: AuthScopeTree
  validityPeriod: Date | null
}

/**
 * Maps and flattens scope tree to a list of scopes
 */
export const formatScopeTreeToScope = ({
  item,
  authScopeTree,
  validityPeriod,
}: MapScopeTreeToScope): MappedScope | null => {
  const flattenScopes = authScopeTree
    ?.map((apiScope) => {
      if (apiScope.__typename === AUTH_API_SCOPE_GROUP_TYPE) {
        return [apiScope, ...(apiScope?.children || [])]
      }

      return apiScope
    })
    .flat()

  const authApiScope = flattenScopes?.find(
    (apiScope) => apiScope.name === item.name[0],
  )

  if (!authApiScope || !validityPeriod || !item.validTo) {
    return null
  }

  return {
    name: authApiScope.name,
    displayName: authApiScope.displayName,
    // validityPeriod has priority over item.validTo
    validTo: validityPeriod ?? item.validTo,
    description: authApiScope?.description,
  }
}
