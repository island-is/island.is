import type { VehicleBenefitResult } from '../../../../gen/fetch'
import type { CalculatorOutputField } from '../../contracts/output'
import { vehicleBenefitCalculator } from './contract'
import { toVehicleBenefitOutput } from './vehicleBenefitOutput'

const outputFieldsByName: Record<string, CalculatorOutputField> =
  Object.fromEntries(
    vehicleBenefitCalculator.outputFields.map((field) => [field.name, field]),
  )

const result: VehicleBenefitResult = {
  kaupar: 1,
  kaupverd: 2,
  arshlunnindi: 3,
  manadarhlunnindi: 4,
}

describe('vehicleBenefit output contract', () => {
  it('declares the curated output field set', () => {
    expect(Object.keys(outputFieldsByName).sort()).toEqual([
      'annualBenefit',
      'monthlyBenefit',
      'purchasePrice',
      'purchaseYear',
    ])
  })

  it('declares each output field as authored', () => {
    expect(outputFieldsByName).toMatchObject({
      purchaseYear: { kind: 'scalar', type: 'number', semantic: 'year' },
      purchasePrice: { kind: 'scalar', type: 'number', semantic: 'currency' },
      annualBenefit: { kind: 'scalar', type: 'number', semantic: 'currency' },
      monthlyBenefit: { kind: 'scalar', type: 'number', semantic: 'currency' },
    })
  })
})

describe('toVehicleBenefitOutput', () => {
  it('emits exactly the contract field set', () => {
    expect(Object.keys(toVehicleBenefitOutput(result)).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
  })

  it('reads each output field from its own RSK source key', () => {
    expect(toVehicleBenefitOutput(result)).toEqual({
      purchaseYear: 1,
      purchasePrice: 2,
      annualBenefit: 3,
      monthlyBenefit: 4,
    })
  })

  it('maps an absent result to undefined scalars, never null', () => {
    const empty: VehicleBenefitResult = {}
    const output = toVehicleBenefitOutput(empty)

    expect(Object.keys(output).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
    expect(output.purchaseYear).toBeUndefined()
    expect(output.purchasePrice).toBeUndefined()
    expect(output.annualBenefit).toBeUndefined()
    expect(output.monthlyBenefit).toBeUndefined()
  })
})
