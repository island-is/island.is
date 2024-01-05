import { validateClientId } from './validateClientId'
import { invalidIds, validIds } from './validateIdMockData'

describe('validateClientId', () => {
  it('should be valid client id', () => {
    validIds.forEach((valid) => {
      expect(validateClientId(valid)).toBe(true)
    })
  })

  it('should be invalid client id', () => {
    const invalidArr = [
      ...invalidIds,
      {
        prefix: '@island.is',
        value: '@island.is/island_is.com-other:other',
      },
    ]

    invalidArr.forEach((invalid) => {
      expect(validateClientId(invalid)).toBe(false)
    })
  })
})
