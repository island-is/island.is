import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScopeInfo } from '../delegations-incoming.service'

export default function filterByCustomScopeRule(
  scope: ApiScopeInfo,
  filterOutForDelegationType: AuthDelegationType[],
  customScopeRules: {
    scopeName: string
    onlyForDelegationType: string[]
  }[],
): boolean {
  const foundCSR = customScopeRules.find((csr) => csr.scopeName === scope.name)

  if (!foundCSR) {
    return true
  }

  return foundCSR.onlyForDelegationType.some((type) =>
    filterOutForDelegationType.includes(type as AuthDelegationType),
  )
}
