import { getMonthNumber } from "./old-age-pension-utils"

describe('getMonthNumber', () => {
    it('should return 3 for March', () => {
        expect(getMonthNumber('March')).toBe(3)
    })
  })