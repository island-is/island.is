import format from 'date-fns/format'
import {
  GROUP,
  Scope,
  SCOPE,
  AuthScopeTree,
  AUTH_API_SCOPE_GROUP_TYPE,
  ScopeGroup,
  AccessFormScope,
  MappedScope,
} from './access.types'

export const DATE_FORMAT = 'dd.MM.yyyy'

export const formatDelegationDate = (dt: string | Date) =>
  format(new Date(dt), DATE_FORMAT)

/**
 * Checks if scope is a scope group type
 */
export const isApiScopeGroup = (scope: Scope): scope is ScopeGroup =>
  scope.__typename === AUTH_API_SCOPE_GROUP_TYPE

/**
 * Gets scopeTree current model index based on order in list and take into account if scope bares children.
 * This makes sure the model indexes will all be unique and in sequential order, i.e. 0,1,2,3,4,5,6,7,8,9,...
 */
const getScopeTreeCurrentModelIndex = (
  authScopes: AuthScopeTree,
  authScopesEndIndex: number,
) => {
  let index = 0

  for (let i = 0; i < authScopesEndIndex; i++) {
    const scope = authScopes[i]

    // If scope has children, add the number of children to the index
    if (scope.__typename === AUTH_API_SCOPE_GROUP_TYPE) {
      index += scope.children ? scope.children.length - 1 : 0
    }

    index++
  }

  return index
}

/**
 * Extends scope with model property for form state
 * @param scope current scope
 * @param index current scope index in list
 * @param scopes list of scopes
 */
export const extendApiScope = (
  scope: AuthScopeTree[0],
  index: number,
  scopes: AuthScopeTree,
): Scope[] => {
  const currentModelIndex = getScopeTreeCurrentModelIndex(scopes, index)

  if (scope.__typename === AUTH_API_SCOPE_GROUP_TYPE) {
    return [
      // Scope parent of the children
      {
        ...scope,
        model: `${GROUP}.${currentModelIndex}`,
      },
      // Scope children
      ...(scope.children?.map((s, childIndex) => ({
        ...s,
        model: `${SCOPE}.${currentModelIndex + childIndex}`,
      })) || []),
    ]
  }

  return [
    {
      ...scope,
      model: `${SCOPE}.${currentModelIndex}`,
    },
  ]
}

type MapScopeTreeToScope = {
  item: AccessFormScope
  scopeTree?: AuthScopeTree
  validityPeriod: Date | null
}

/**
 * Maps and flattens scope tree to a list of scopes
 */
export const formatScopeTreeToScope = ({
  item,
  scopeTree,
  validityPeriod,
}: MapScopeTreeToScope): MappedScope | null => {
  const flattenScopes = scopeTree
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
  const validTo = validityPeriod ?? item.validTo

  if (!authApiScope || !validTo) {
    return null
  }

  return {
    name: authApiScope.name,
    displayName: authApiScope.displayName,
    // validityPeriod has priority over item.validTo
    validTo,
    description: authApiScope?.description,
  }
}
