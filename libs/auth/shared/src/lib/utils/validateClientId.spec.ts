import { validateClientId } from './validateClientId'

describe('validateClientId', () => {
  it('should be valid client id', () => {
    const validArr = [
      {
        prefix: '@island.is',
        value: '@island.is/island',
      },
      {
        prefix: '@island.is',
        value: '@island.is/island-is',
      },
      {
        prefix: '@island.is',
        value: '@island.is/island-is-other',
      },
      {
        prefix: '@island.is',
        value: '@island.is/island_is',
      },
      {
        prefix: '@island.is',
        value: '@island.is/island_is_other',
      },
      {
        prefix: '@island.is',
        value: '@island.is/island.is',
      },
      {
        prefix: '@island.is',
        value: '@island.is/island.is.com',
      },
      {
        prefix: '@island.is',
        value: '@island.is/island_is.com-other',
      },
    ]

    validArr.forEach((valid) => {
      expect(validateClientId(valid)).toBe(true)
    })
  })

  it('should be invalid client id', () => {
    const invalidArr = [
      {
        prefix: '@island.is',
        value: '@island.isisland-is',
      },
      {
        prefix: '@island.is',
        value: '@island/islandis',
      },
      {
        prefix: '@island.is',
        value: '@island.is/islandis"',
      },
      {
        prefix: '@island.is',
        value: '@island.is/_islandis',
      },
      {
        prefix: '@island.is',
        value: '@island.is/.islandis',
      },
      {
        prefix: '@island.is',
        value: '@island.is/-islandis',
      },
      {
        prefix: '@island.is',
        value: '@island.is/island=is',
      },
      {
        prefix: '@island.is',
        value: '@island.is/island!is',
      },
    ]

    invalidArr.forEach((invalid) => {
      expect(validateClientId(invalid)).toBe(false)
    })
  })
})
