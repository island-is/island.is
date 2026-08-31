import { getCombinedValidity, getValidity, parseApiDate } from './validity'

const REFERENCE = '2026-01-20T00:00:00Z'

describe('parseApiDate', () => {
  it('parses the non ISO format the upstream API returns', () => {
    expect(parseApiDate('Fri Jan 01 00:00:00 GMT 2027')?.getFullYear()).toBe(
      2027,
    )
  })

  it('returns undefined for missing or unparsable values', () => {
    expect(parseApiDate(undefined)).toBeUndefined()
    expect(parseApiDate(null)).toBeUndefined()
    expect(parseApiDate('')).toBeUndefined()
    expect(parseApiDate('not a date')).toBeUndefined()
  })
})

describe('getValidity', () => {
  it('flags entries that only take effect after the reference date', () => {
    const validity = getValidity(
      REFERENCE,
      'Fri Jan 01 00:00:00 GMT 2027',
      'Mon Dec 31 00:00:00 GMT 2300',
    )

    expect(validity.notYetInEffect).toBe(true)
    expect(validity.validFrom?.getFullYear()).toBe(2027)
    expect(validity.validTo?.getFullYear()).toBe(2300)
  })

  it('does not flag entries that are already in effect', () => {
    expect(
      getValidity(
        REFERENCE,
        'Wed Jan 01 00:00:00 GMT 2020',
        'Mon Dec 31 00:00:00 GMT 2300',
      ).notYetInEffect,
    ).toBe(false)
  })

  it('does not flag an entry taking effect on the reference date itself', () => {
    expect(
      getValidity(REFERENCE, 'Tue Jan 20 00:00:00 GMT 2026', null)
        .notYetInEffect,
    ).toBe(false)
  })

  it('does not flag entries with no start date', () => {
    expect(getValidity(REFERENCE, null, null).notYetInEffect).toBe(false)
  })
})

describe('getCombinedValidity', () => {
  it('takes the later start and the earlier end of the two ranges', () => {
    const validity = getCombinedValidity(
      REFERENCE,
      {
        from: 'Wed Jan 01 00:00:00 GMT 2020',
        to: 'Mon Dec 31 00:00:00 GMT 2300',
      },
      {
        from: 'Fri Jan 01 00:00:00 GMT 2027',
        to: 'Sat Dec 31 00:00:00 GMT 2050',
      },
    )

    expect(validity.validFrom?.getFullYear()).toBe(2027)
    expect(validity.validTo?.getFullYear()).toBe(2050)
    expect(validity.notYetInEffect).toBe(true)
  })

  it('is in effect only once both sides are', () => {
    expect(
      getCombinedValidity(
        REFERENCE,
        { from: 'Wed Jan 01 00:00:00 GMT 2020', to: null },
        { from: 'Wed Jan 01 00:00:00 GMT 2025', to: null },
      ).notYetInEffect,
    ).toBe(false)
  })
})
