import { getIndictmentCivilDemands } from './indictmentPdf'

describe('getIndictmentCivilDemands', () => {
  it('returns the civil demands when the case has civil claims', () => {
    expect(getIndictmentCivilDemands(true, 'Bótakrafa')).toBe('Bótakrafa')
  })

  it('returns undefined when hasCivilClaims is false', () => {
    expect(getIndictmentCivilDemands(false, 'Bótakrafa')).toBeUndefined()
  })

  it('returns undefined when hasCivilClaims is undefined', () => {
    expect(getIndictmentCivilDemands(undefined, 'Bótakrafa')).toBeUndefined()
  })

  it('returns undefined when civil demands are missing', () => {
    expect(getIndictmentCivilDemands(true, undefined)).toBeUndefined()
  })

  it('returns undefined when civil demands are empty', () => {
    expect(getIndictmentCivilDemands(true, '')).toBeUndefined()
  })
})
