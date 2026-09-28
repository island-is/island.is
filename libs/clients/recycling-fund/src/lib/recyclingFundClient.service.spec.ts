import { shortPermno } from './recyclingFundClient.service'

describe('shortPermno', () => {
  it('keeps the last three characters of an ordinary registration number', () => {
    expect(shortPermno('AH-H32')).toBe('H32')
    expect(shortPermno('AB123')).toBe('123')
  })

  // slice(-3) returns the whole number for anything this short, so the
  // shortening would have hidden nothing. Icelandic personalised plates can be
  // two or three characters.
  it.each(['XY1', 'ABC', 'AB', 'A'])(
    'logs nothing at all for the short registration number %s',
    (permno) => {
      expect(shortPermno(permno)).toBe('')
    },
  )

  it('handles an empty registration number', () => {
    expect(shortPermno('')).toBe('')
  })
})
