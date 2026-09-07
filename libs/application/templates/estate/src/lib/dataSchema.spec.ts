import { estateSchema } from './dataSchema'
import { m } from './messages'

describe('estateSchema', () => {
  const vehicleSchema = estateSchema.shape.estate.shape.vehicles

  const vehicle = {
    assetNumber: 'AB123',
    description: 'Vehicle',
    marketValue: '500000',
    initial: false,
    enabled: true,
    share: 100,
  }

  it('rejects enabled vehicles with 0 kr. market value', () => {
    const result = vehicleSchema.safeParse([
      {
        ...vehicle,
        marketValue: '0',
      },
    ])

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: [0, 'marketValue'],
            params: m.errorMarketValue,
          }),
        ]),
      )
    }
  })

  it('accepts enabled vehicles with market value above 0 kr.', () => {
    expect(() => vehicleSchema.parse([vehicle])).not.toThrow()
  })

  it('accepts disabled vehicles with 0 kr. market value', () => {
    expect(() =>
      vehicleSchema.parse([
        {
          ...vehicle,
          enabled: false,
          marketValue: '0',
        },
      ]),
    ).not.toThrow()
  })
})
