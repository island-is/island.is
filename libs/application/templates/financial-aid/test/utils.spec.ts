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
      const validEmail = isValidEmail('test@is.is')

      expect(validEmail).toEqual(true)
    })
  })

  describe('is phone valid test', () => {
    test('should return that phone is not valid', () => {
      const notValidPhone = isValidPhone('test')

      expect(notValidPhone).toEqual(false)
    })
  })

  describe('is phone valid test', () => {
    test('should return that phone is not valid', () => {
      const notValidPhone = isValidPhone('+0001111')

      expect(notValidPhone).toEqual(false)
    })
  })

  describe('is phone valid test', () => {
    test('should return that phone is not valid', () => {
      const notValidPhone = isValidPhone('+354 000 1111')
      expect(notValidPhone).toEqual(false)
    })
  })
  describe('is phone valid test', () => {
    test('should return that phone is valid', () => {
      const notValidPhone = isValidPhone('0000000')
      expect(notValidPhone).toEqual(false)
    })
  })

  describe('is phone valid test', () => {
    test('should return that phone is valid', () => {
      const validPhone = isValidPhone('5677977')
      expect(validPhone).toEqual(true)
    })
  })
})
