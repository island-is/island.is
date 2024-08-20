// Write tests for the utils functions
import { formatIsk } from './utils'

describe('utils', () => {
  describe('formatIsk', () => {
    it('should format a number to Icelandic currency', () => {
      expect(formatIsk(1)).toBe('1 kr.')
      expect(formatIsk(22)).toBe('22 kr.')
      expect(formatIsk(333)).toBe('333 kr.')
      expect(formatIsk(4_444)).toBe('4.444 kr.')
      expect(formatIsk(55_555)).toBe('55.555 kr.')
      expect(formatIsk(666_666)).toBe('666.666 kr.')
      expect(formatIsk(7_777_777)).toBe('7.777.777 kr.')
      expect(formatIsk(88_888_888)).toBe('88.888.888 kr.')
      expect(formatIsk(999_999_999)).toBe('999.999.999 kr.')
      expect(formatIsk(1_010_101_010)).toBe('1.010.101.010 kr.')
    })
  })
})
