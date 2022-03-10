import { isValid24HFormatTime } from './index'
describe('Health insurance utils', () => {
  const validString = '2359'
  const tooLongString = '23599'
  const threeLetterString = '123'
  const twoLetterString = '12'
  const oneLetterString = '1'
  const emptyString = ''
  const illlegalHourString = '2459'
  const illlegalMinuteString = '2364'

  describe('Check time format validation logic', () => {
    it('should return true for 2359', () => {
      expect(isValid24HFormatTime(validString)).toEqual(true)
    })
    it('should return false for 23599', () => {
      expect(isValid24HFormatTime(tooLongString)).toEqual(false)
    })
    it('should return false for 123', () => {
      expect(isValid24HFormatTime(threeLetterString)).toEqual(false)
    })
    it('should return false for 12', () => {
      expect(isValid24HFormatTime(twoLetterString)).toEqual(false)
    })
    it('should return false for 1', () => {
      expect(isValid24HFormatTime(oneLetterString)).toEqual(false)
    })
    it('should return false for empty string', () => {
      expect(isValid24HFormatTime(emptyString)).toEqual(false)
    })
    it('should return false for 2459', () => {
      expect(isValid24HFormatTime(illlegalHourString)).toEqual(false)
    })
    it('should return false for 2364', () => {
      expect(isValid24HFormatTime(illlegalMinuteString)).toEqual(false)
    })
  })
})
