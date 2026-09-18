import type { CalculatorField } from '../../contracts/field'
import type { VehicleBenefitInput } from './contract'
import { vehicleBenefitCalculator } from './contract'
import { toVehicleBenefitQuery } from './vehicleBenefit'

const fieldsByName: Record<string, CalculatorField> = Object.fromEntries(
  vehicleBenefitCalculator.inputFields.map((field) => [field.name, field]),
)

describe('vehicleBenefit contract', () => {
  it('declares each field as authored', () => {
    expect(Object.keys(fieldsByName).sort()).toEqual([
      'employeePaysCharging',
      'employeePaysRunningCosts',
      'isElectric',
      'purchasePrice',
      'purchaseYear',
    ])
    expect(fieldsByName).toMatchObject({
      purchaseYear: { type: 'number', required: true, semantic: 'year' },
      purchasePrice: { type: 'number', required: true, semantic: 'currency' },
      isElectric: { type: 'boolean', required: false },
      employeePaysCharging: { type: 'boolean', required: false },
      employeePaysRunningCosts: { type: 'boolean', required: false },
    })
  })

  it('keeps the three RSK-required booleans optional', () => {
    for (const name of [
      'isElectric',
      'employeePaysCharging',
      'employeePaysRunningCosts',
    ]) {
      expect(fieldsByName[name].required).toBe(false)
    }
  })
})

describe('toVehicleBenefitQuery', () => {
  const input: VehicleBenefitInput = {
    purchaseYear: 2024,
    purchasePrice: 6000000,
  }

  it('defaults the omitted booleans to false', () => {
    expect(toVehicleBenefitQuery(input)).toEqual({
      kaupar: 2024,
      kaupverd: 6000000,
      rafbill: false,
      starfsmadurGreidirHledslu: false,
      starfsmadurGreidirRekstrarkostnad: false,
    })
  })

  it('forwards the booleans when given', () => {
    expect(
      toVehicleBenefitQuery({
        ...input,
        isElectric: true,
        employeePaysCharging: true,
        employeePaysRunningCosts: true,
      }),
    ).toMatchObject({
      rafbill: true,
      starfsmadurGreidirHledslu: true,
      starfsmadurGreidirRekstrarkostnad: true,
    })
  })
})
