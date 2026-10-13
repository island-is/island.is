import { toWithholdingTaxInput } from './withholdingTax'

describe('client input builders', () => {
  it('builds a withholding tax input from nothing at all', () => {
    expect(
      Object.values(toWithholdingTaxInput({})).every(
        (value) => value === undefined,
      ),
    ).toBe(true)
  })

  it('carries whole-percent values through unchanged', () => {
    expect(toWithholdingTaxInput({ taxCardUtilization: 37 })).toMatchObject({
      taxCardUtilization: 37,
    })
  })
})
