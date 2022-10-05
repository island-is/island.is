import { DelegationScopeDTO } from '../dto/delegation-scope.dto'
import { compareScopesByName } from './scopes'

describe('compareScopesByName', () => {
  it('should return true when scopeName is equal', () => {
    // Arrange
    const scopeA: DelegationScopeDTO = {
      delegationId: 'f6967594-a627-4368-9068-21cbb03d54cd',
      displayName: 'My scope A',
      scopeName: '@island.is/test-scope-A',
      validFrom: new Date(),
    }
    const scopeB: DelegationScopeDTO = {
      ...scopeA,
      delegationId: '39d02c9b-eafc-45f1-b345-91cde062d057',
    }

    // Act
    const result = compareScopesByName(scopeA, scopeB)

    // Assert
    expect(result).toBe(true)
  })

  it('should return false when scopeName is not equal', () => {
    // Arrange
    const scopeA: DelegationScopeDTO = {
      delegationId: 'f6967594-a627-4368-9068-21cbb03d54cd',
      displayName: 'My scope A',
      scopeName: '@island.is/test-scope-A',
      validFrom: new Date(),
    }
    const scopeB: DelegationScopeDTO = {
      delegationId: '39d02c9b-eafc-45f1-b345-91cde062d057',
      displayName: 'My scope B',
      scopeName: '@island.is/test-scope-B',
      validFrom: new Date(),
    }

    // Act
    const result = compareScopesByName(scopeA, scopeB)

    // Assert
    expect(result).toBe(false)
  })
})
