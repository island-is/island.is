import { clamp } from './utils'

describe('utils', () => {
  describe('clamp', () => {
    it('clamps value between min and max', () => {
      const min = 1,
        max = 10
      expect(clamp(-100, min, max)).toBe(1)
      expect(clamp(1, min, max)).toBe(1)
      expect(clamp(5, min, max)).toBe(5)
      expect(clamp(10, min, max)).toBe(10)
      expect(clamp(100, min, max)).toBe(10)
    })
  })
})
