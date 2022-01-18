import { isValidEmail, isValidPhone } from '../src/lib/utils'

describe('Utilts test', () => {
  describe('is email valid test', () => {
    test('should return that email is not valid', () => {
      const notValidEmail = isValidEmail('test')

      expect(notValidEmail).toEqual(false)
    })
  })
  describe('is email valid test', () => {
    test('should return that email is not valid', () => {
      const notValidEmail = isValidEmail('test@')

      expect(notValidEmail).toEqual(false)
    })
  })

  describe('is email valid test', () => {
    test('should return that email is not valid', () => {
      const notValidEmail = isValidEmail('test@is')

      expect(notValidEmail).toEqual(false)
    })
  })
  describe('is email valid test', () => {
    test('should return that email is valid', () => {
      const notValidEmail = isValidEmail('test@is.is')

      expect(notValidEmail).toEqual(true)
    })
  })

  describe('is email valid test', () => {
    test('should return that email is valid', () => {
      const notValidEmail = isValidEmail('test@is.is')

      expect(notValidEmail).toEqual(true)
    })
  })

  describe('is phone valid test', () => {
    test('should return that phone is not valid', () => {
      const notValidEmail = isValidPhone('test')

      expect(notValidEmail).toEqual(false)
    })
  })

  describe('is phone valid test', () => {
    test('should return that phone is not valid', () => {
      const notValidEmail = isValidPhone('+0001111')

      expect(notValidEmail).toEqual(false)
    })
  })

  describe('is phone valid test', () => {
    test('should return that phone is not valid', () => {
      const notValidEmail = isValidPhone('+354 000 1111')
      expect(notValidEmail).toEqual(false)
    })
  })
  describe('is phone valid test', () => {
    test('should return that phone is valid', () => {
      const notValidEmail = isValidPhone('0000000')
      expect(notValidEmail).toEqual(false)
    })
  })

  describe('is phone valid test', () => {
    test('should return that phone is valid', () => {
      const notValidEmail = isValidPhone('5677977')
      expect(notValidEmail).toEqual(true)
    })
  })
})
