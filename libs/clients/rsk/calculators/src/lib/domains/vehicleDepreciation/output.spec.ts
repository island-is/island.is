import type { VehicleDepreciationResult } from '../../../../gen/fetch'
import { toVehicleDepreciationOutput } from './output'

const result: VehicleDepreciationResult = {
  kaupreikningur: true,
  verd: 2,
  vsk: 3,
  alagning: 4,
  vorugjald: 5,
  vatrygging: 6,
  flutningsgjald: 7,
  fyrstu12Manudir: 8,
  naestu24Manudir: 9,
  rest: 10,
  totalFyrning: 11,
  finalAmount: 12,
}

describe('toVehicleDepreciationOutput', () => {
  it('reads each output field from its own RSK source key', () => {
    expect(toVehicleDepreciationOutput(result)).toEqual({
      hasPurchaseInvoice: true,
      price: 2,
      vat: 3,
      markup: 4,
      exciseFee: 5,
      insurance: 6,
      transportFee: 7,
      first12MonthsDepreciation: 8,
      next24MonthsDepreciation: 9,
      remainingValue: 10,
      totalDepreciation: 11,
      finalAmount: 12,
    })
  })

  it('maps an absent result to undefined scalars, never null', () => {
    const empty: VehicleDepreciationResult = {
      verd: null,
      vsk: null,
      alagning: null,
      vorugjald: null,
      vatrygging: null,
      flutningsgjald: null,
      fyrstu12Manudir: null,
      naestu24Manudir: null,
      rest: null,
      totalFyrning: null,
      finalAmount: null,
    }
    const output = toVehicleDepreciationOutput(empty)

    expect(output.hasPurchaseInvoice).toBeUndefined()
    expect(output.price).toBeUndefined()
    expect(output.vat).toBeUndefined()
    expect(output.markup).toBeUndefined()
    expect(output.exciseFee).toBeUndefined()
    expect(output.insurance).toBeUndefined()
    expect(output.transportFee).toBeUndefined()
    expect(output.first12MonthsDepreciation).toBeUndefined()
    expect(output.next24MonthsDepreciation).toBeUndefined()
    expect(output.remainingValue).toBeUndefined()
    expect(output.totalDepreciation).toBeUndefined()
    expect(output.finalAmount).toBeUndefined()
  })
})
