import { validateApplicationId } from './CreateApplication.action'

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

describe('CreateApplicationAction', () => {
  it('Should be valid application id', () => {
    validValues.forEach((value) => {
      const valid = validateApplicationId({
        prefix: '@island-is',
        value,
      })
      expect(valid).toBe(true)
    })
  })

  it('Should be invalid application id', () => {
    invalidValues.forEach((value) => {
      const valid = validateApplicationId({
        prefix: '@island-is',
        value,
      })
      expect(valid).toBe(false)
    })
  })
})
