import { parseDateIfValid } from '../utils'

describe('IP Utils', () => {
  describe('parseDateIfValid', () => {
    describe('Should return a parsed date if the provided string matches a provided format, if any', () => {
      it('should parse if a valid date is provided', () => {
        const date = new Date()
        expect(parseDateIfValid(date)).toEqual(date)
      })

      it('should parse if a valid date ISO string is provided', () => {
        const date = new Date()
        expect(parseDateIfValid(date.toISOString())).toEqual(date)
      })

      it('should parse if valid date string with correct format', () => {
        expect(
          parseDateIfValid('01.02.1993 12:12:12', 'dd.MM.yyyy HH:mm:SS'),
        ).toEqual(new Date('1993-02-01T12:12:00.120Z'))
      })
      it('should abort if invalid date string is provided with no formatString', () => {
        expect(parseDateIfValid('12345')).toBeUndefined()
      })

      it('should abort if no date string is provided with no formatString', () => {
        expect(parseDateIfValid('')).toBeUndefined()
      })

      it('should abort if placeholder date', () => {
        expect(parseDateIfValid('0001-01-01T')).toBeUndefined()
      })
    })
  })
})
