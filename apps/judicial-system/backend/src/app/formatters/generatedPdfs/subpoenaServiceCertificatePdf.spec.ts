import { getCivilClaimsServiceText } from './subpoenaServiceCertificatePdf'

describe('getCivilClaimsServiceText', () => {
  it('should return undefined when hasCivilClaims is false', () => {
    expect(getCivilClaimsServiceText(false, 0)).toBeUndefined()
  })

  it('should return undefined when hasCivilClaims is undefined', () => {
    expect(getCivilClaimsServiceText(undefined, 2)).toBeUndefined()
  })

  it('should return singular text when there is one civil claimant', () => {
    expect(getCivilClaimsServiceText(true, 1)).toBe(
      'Greinargerð vegna bótakröfu í málinu hefur jafnframt verið birt.',
    )
  })

  it('should return singular text when civilClaimantsCount is undefined', () => {
    expect(getCivilClaimsServiceText(true, undefined)).toBe(
      'Greinargerð vegna bótakröfu í málinu hefur jafnframt verið birt.',
    )
  })

  it('should return singular text when civilClaimantsCount is zero', () => {
    expect(getCivilClaimsServiceText(true, 0)).toBe(
      'Greinargerð vegna bótakröfu í málinu hefur jafnframt verið birt.',
    )
  })

  it('should return plural text when there are multiple civil claimants', () => {
    expect(getCivilClaimsServiceText(true, 2)).toBe(
      'Greinargerðir vegna bótakrafna í málinu hafa jafnframt verið birtar.',
    )
  })

  it('should return plural text when there are many civil claimants', () => {
    expect(getCivilClaimsServiceText(true, 5)).toBe(
      'Greinargerðir vegna bótakrafna í málinu hafa jafnframt verið birtar.',
    )
  })
})
