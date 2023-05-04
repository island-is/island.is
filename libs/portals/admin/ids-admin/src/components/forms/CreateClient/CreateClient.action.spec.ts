import { validateClientId } from '@island.is/auth/shared'

const validValues = [
  '@island-is/ids-admin',
  '@island-is/ids-admin-frontend',
  '@island-is/ids/admin/front-end',
  '@island-is/ids/admin_front-end.1',
  '@island-is/123/admin_front-end.1',
]

const invalidValues = [
  '@island-is/ids--admin',
  '@island-is/ids-',
  '@island-is/ids//admin/front-end',
  '@island-is/../admin_front-end.1',
  '@island-is/123/admin__front-end.1',
]

describe('CreateClientAction', () => {
  it('Should be valid client id', () => {
    validValues.forEach((value) => {
      const valid = validateClientId({
        prefix: '@island-is',
        value,
      })
      expect(valid).toBe(true)
    })
  })

  it('Should be invalid client id', () => {
    invalidValues.forEach((value) => {
      const valid = validateClientId({
        prefix: '@island-is',
        value,
      })
      expect(valid).toBe(false)
    })
  })
})
