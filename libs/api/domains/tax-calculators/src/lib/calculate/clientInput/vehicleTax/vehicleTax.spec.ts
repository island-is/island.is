import { toVehicleTaxInput } from './vehicleTax'

describe('client input builders', () => {
  it('builds a vehicle tax input, narrowing the period to its literal union', () => {
    expect(
      toVehicleTaxInput({
        year: 2026,
        licensePlate: 'AB123',
        period: 'secondHalf',
        periodSplitDate: '2026-06-01',
      }),
    ).toEqual({
      year: 2026,
      licensePlate: 'AB123',
      period: 'secondHalf',
      periodSplitDate: '2026-06-01',
    })
  })

  /* Guards fail on post-validation drift. */
  describe('internal guards', () => {
    it('throws when a required field is absent', () => {
      expect(() => toVehicleTaxInput({ year: 2026 })).toThrow(
        /missing required field "licensePlate"/,
      )
    })

    it('throws when a required field carries the wrong kind', () => {
      expect(() =>
        toVehicleTaxInput({
          year: 2026,
          licensePlate: 42,
          period: 'firstHalf',
        }),
      ).toThrow(/non-string value for "licensePlate"/)
    })

    it('throws on an option outside the permitted tuple', () => {
      expect(() =>
        toVehicleTaxInput({
          year: 2026,
          licensePlate: 'AB123',
          period: 'thirdHalf',
        }),
      ).toThrow(/permitted option/)
    })
  })
})
