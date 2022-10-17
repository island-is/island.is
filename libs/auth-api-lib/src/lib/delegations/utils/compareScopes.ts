import { DelegationScopeDTO } from '../dto/delegation-scope.dto'

/**
 * Comparator function for DelegationScopeDTO that
 * compares equality by `scopeName`
 *
 * @param scopeA
 * @param scopeB
 * @returns true if scopeName are equal, otherwise false.
 */
export const compareScopesByName = (
  scopeA: DelegationScopeDTO,
  scopeB: DelegationScopeDTO,
): boolean => {
  return scopeA.scopeName === scopeB.scopeName
}
