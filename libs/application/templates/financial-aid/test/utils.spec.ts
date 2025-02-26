import { isValidEmail, isValidNationalId, isValidPhone } from '../src/lib/utils'

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

  describe('is kennitala valid test', () => {
    test('should return that national id is  not valid', () => {
      const notValidNationalId = isValidNationalId('5677977')
      expect(notValidNationalId).toEqual(false)
    })
  })
  describe('is kennitala valid test', () => {
    test('should return that national id is  not valid', () => {
      const notValidNationalId = isValidNationalId('010101-3320')
      expect(notValidNationalId).toEqual(false)
    })
  })

  describe('is kennitala valid test', () => {
    test('should return that national id is  valid', () => {
      const validNationalId = isValidNationalId('010105-2180')
      expect(validNationalId).toEqual(true)
    })
  })

  describe('is kennitala valid test', () => {
    test('should return that national id is valid', () => {
      const validNationalId = isValidNationalId('0101052180')
      expect(validNationalId).toEqual(true)
    })
  })
})
