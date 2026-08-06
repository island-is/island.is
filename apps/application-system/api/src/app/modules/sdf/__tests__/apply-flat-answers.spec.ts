import { applyFlatAnswers } from '../apply-flat-answers'

describe('applyFlatAnswers', () => {
  it('expands a dotted client key into a nested object', () => {
    expect(
      applyFlatAnswers({}, { 'applicant.phoneNumber': '+3545812345' }),
    ).toEqual({
      applicant: { phoneNumber: '+3545812345' },
    })
  })

  it('deep-merges onto existing nested siblings instead of clobbering them', () => {
    const base = {
      applicant: { name: 'Gervimaður', email: 'a@b.is' },
    }
    // The reproduction case: the user typed a phone number, which a shallow
    // `{ ...base, ...client }` spread would have stranded under the flat key,
    // leaving the nested `applicant.phoneNumber` undefined → "Required".
    expect(
      applyFlatAnswers(base, { 'applicant.phoneNumber': '+3545812345' }),
    ).toEqual({
      applicant: {
        name: 'Gervimaður',
        email: 'a@b.is',
        phoneNumber: '+3545812345',
      },
    })
  })

  it('keeps plain top-level keys flat', () => {
    expect(
      applyFlatAnswers({}, { description: 'hi', usageUnits: ['a', 'b'] }),
    ).toEqual({ description: 'hi', usageUnits: ['a', 'b'] })
  })

  it('does not mutate the base tree', () => {
    const base = { applicant: { name: 'Gervimaður' } }
    applyFlatAnswers(base, { 'applicant.phoneNumber': '+3545812345' })
    expect(base).toEqual({ applicant: { name: 'Gervimaður' } })
  })

  it('treats undefined client answers as a no-op clone', () => {
    const base = { applicant: { name: 'Gervimaður' } }
    expect(applyFlatAnswers(base, undefined)).toEqual(base)
  })
})
