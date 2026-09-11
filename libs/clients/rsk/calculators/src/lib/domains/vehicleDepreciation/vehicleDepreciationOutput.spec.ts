import type { VehicleDepreciationResult } from '../../../../gen/fetch'
import type { CalculatorOutputField } from '../../contracts/output'
import { vehicleDepreciationCalculator } from './contract'
import { toVehicleDepreciationOutput } from './vehicleDepreciationOutput'

const outputFieldsByName: Record<string, CalculatorOutputField> =
  Object.fromEntries(
    vehicleDepreciationCalculator.outputFields.map((field) => [
      field.name,
      field,
    ]),
  )

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

describe('vehicleDepreciation output contract', () => {
  it('declares the curated output field set', () => {
    expect(Object.keys(outputFieldsByName).sort()).toEqual([
      'exciseFee',
      'finalAmount',
      'first12MonthsDepreciation',
      'hasPurchaseInvoice',
      'insurance',
      'markup',
      'next24MonthsDepreciation',
      'price',
      'remainingValue',
      'totalDepreciation',
      'transportFee',
      'vat',
    ])
  })

  it('declares each output field as authored', () => {
    expect(outputFieldsByName).toMatchObject({
      hasPurchaseInvoice: { kind: 'scalar', type: 'boolean' },
      price: { kind: 'scalar', type: 'number', semantic: 'currency' },
      vat: { kind: 'scalar', type: 'number', semantic: 'currency' },
      markup: { kind: 'scalar', type: 'number', semantic: 'currency' },
      exciseFee: { kind: 'scalar', type: 'number', semantic: 'currency' },
      insurance: { kind: 'scalar', type: 'number', semantic: 'currency' },
      transportFee: { kind: 'scalar', type: 'number', semantic: 'currency' },
      first12MonthsDepreciation: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      next24MonthsDepreciation: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      remainingValue: { kind: 'scalar', type: 'number', semantic: 'currency' },
      totalDepreciation: {
        kind: 'scalar',
        type: 'number',
        semantic: 'currency',
      },
      finalAmount: { kind: 'scalar', type: 'number', semantic: 'currency' },
    })
  })
})

describe('toVehicleDepreciationOutput', () => {
  it('emits exactly the contract field set', () => {
    expect(Object.keys(toVehicleDepreciationOutput(result)).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
  })

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
    /* Every nullable source key set to null, every other one omitted, so
     * both flavours of absence are covered by one fixture. */
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

    expect(Object.keys(output).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
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
