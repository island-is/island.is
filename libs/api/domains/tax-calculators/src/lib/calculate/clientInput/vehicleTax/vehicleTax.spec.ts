import { toVehicleTaxInput } from './vehicleTax'

describe('client input builders', () => {
  it('builds a vehicle tax input, passing the split date through as a Date', () => {
    const gjaldskipting = new Date('2026-03-01T00:00:00.000Z')

    expect(
      toVehicleTaxInput({
        ar: 2026,
        bilnumer: 'AB123',
        gjaldtimabil: '1. júlí - 31. des',
        gjaldskipting,
      }),
    ).toEqual({
      ar: 2026,
      bilnumer: 'AB123',
      gjaldtimabil: '1. júlí - 31. des',
      gjaldskipting,
    })
  })

  /* Guards fail on post-validation drift. */
  describe('internal guards', () => {
    it('throws when a required field is absent', () => {
      expect(() => toVehicleTaxInput({ ar: 2026 })).toThrow(
        /missing required field "bilnumer"/,
      )
    })

    it('throws when a required field carries the wrong kind', () => {
      expect(() =>
        toVehicleTaxInput({
          ar: 2026,
          bilnumer: 42,
          gjaldtimabil: '1. jan - 30. júlí',
        }),
      ).toThrow(/non-string value for "bilnumer"/)
    })

    it('throws on an option outside the generated enum', () => {
      expect(() =>
        toVehicleTaxInput({
          ar: 2026,
          bilnumer: 'AB123',
          gjaldtimabil: 'firstHalf',
        }),
      ).toThrow(/permitted option/)
    })

    it('throws on a split date that is not a Date', () => {
      expect(() =>
        toVehicleTaxInput({
          ar: 2026,
          bilnumer: 'AB123',
          gjaldtimabil: '1. jan - 30. júlí',
          gjaldskipting: '2026-03-01',
        }),
      ).toThrow(/non-date value for "gjaldskipting"/)
    })
  })
})
