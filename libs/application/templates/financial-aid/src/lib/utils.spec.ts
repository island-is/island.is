import { isValidEmail } from './utils'

describe('Utilts test', () => {
  describe('is email valid test', () => {
    test('should return that email is not valid', () => {
      const notValidEmail = isValidEmail('test')

      expect(notValidEmail).toEqual(false)
    })
  })
})
