import { validatePermissionId } from './validatePermissionId'
import { invalidIds, validIds } from './validateIdMockData'

describe('validatePermissionId', () => {
  it('should be valid permission id', () => {
    const validArr = [
      ...validIds,
      {
        prefix: '@island.is',
        value: '@island.is/island_is.com-other:other',
      },
    ]

    validArr.forEach((valid) => {
      expect(validatePermissionId(valid)).toBe(true)
    })
  })

  it('should be invalid permission id', () => {
    invalidIds.forEach((invalid) => {
      expect(validatePermissionId(invalid)).toBe(false)
    })
  })
})
