import type { VehicleTaxResult } from '../../../../gen/fetch'
import type { CalculatorOutputField } from '../../contracts/output'
import { vehicleTaxCalculator } from './contract'
import { toVehicleTaxOutput } from './vehicleTaxOutput'

const outputFieldsByName: Record<string, CalculatorOutputField> =
  Object.fromEntries(
    vehicleTaxCalculator.outputFields.map((field) => [field.name, field]),
  )

const result: VehicleTaxResult = {
  timabil: 'text-1',
  gjaldar: 2,
  eiginthyngd: 3,
  co2: 4,
  nedc: 5,
  wltp: 6,
  bifreidagjold: 7,
  urvinnslugjald: 8,
  bifreidagjoldAlls: 9,
}

describe('vehicleTax output contract', () => {
  it('declares the curated output field set', () => {
    expect(Object.keys(outputFieldsByName).sort()).toEqual([
      'co2',
      'feeYear',
      'nedc',
      'periodLabel',
      'recyclingFee',
      'totalVehicleTax',
      'vehicleTax',
      'vehicleWeight',
      'wltp',
    ])
  })

  it('declares each output field as authored', () => {
    expect(outputFieldsByName).toMatchObject({
      periodLabel: { kind: 'scalar', type: 'string' },
      feeYear: { kind: 'scalar', type: 'number', semantic: 'year' },
      vehicleWeight: { kind: 'scalar', type: 'number' },
      co2: { kind: 'scalar', type: 'number' },
      nedc: { kind: 'scalar', type: 'number' },
      wltp: { kind: 'scalar', type: 'number' },
      vehicleTax: { kind: 'scalar', type: 'number', semantic: 'currency' },
      recyclingFee: { kind: 'scalar', type: 'number', semantic: 'currency' },
      totalVehicleTax: { kind: 'scalar', type: 'number', semantic: 'currency' },
    })
  })

  it('withholds a semantic from numeric codes and raw numbers', () => {
    expect(outputFieldsByName['vehicleWeight'].kind).toBe('scalar')
    expect(outputFieldsByName['vehicleWeight']).not.toHaveProperty('semantic')
    expect(outputFieldsByName['co2'].kind).toBe('scalar')
    expect(outputFieldsByName['co2']).not.toHaveProperty('semantic')
    expect(outputFieldsByName['nedc'].kind).toBe('scalar')
    expect(outputFieldsByName['nedc']).not.toHaveProperty('semantic')
    expect(outputFieldsByName['wltp'].kind).toBe('scalar')
    expect(outputFieldsByName['wltp']).not.toHaveProperty('semantic')
  })
})

describe('toVehicleTaxOutput', () => {
  it('emits exactly the contract field set', () => {
    expect(Object.keys(toVehicleTaxOutput(result)).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
  })

  it('reads each output field from its own RSK source key', () => {
    expect(toVehicleTaxOutput(result)).toEqual({
      periodLabel: 'text-1',
      feeYear: 2,
      vehicleWeight: 3,
      co2: 4,
      nedc: 5,
      wltp: 6,
      vehicleTax: 7,
      recyclingFee: 8,
      totalVehicleTax: 9,
    })
  })

  it('maps an absent result to undefined scalars, never null', () => {
    /* Every nullable source key set to null, every other one omitted, so
     * both flavours of absence are covered by one fixture. */
    const empty: VehicleTaxResult = {
      timabil: null,
    }
    const output = toVehicleTaxOutput(empty)

    expect(Object.keys(output).sort()).toEqual(
      Object.keys(outputFieldsByName).sort(),
    )
    expect(output.periodLabel).toBeUndefined()
    expect(output.feeYear).toBeUndefined()
    expect(output.vehicleWeight).toBeUndefined()
    expect(output.co2).toBeUndefined()
    expect(output.nedc).toBeUndefined()
    expect(output.wltp).toBeUndefined()
    expect(output.vehicleTax).toBeUndefined()
    expect(output.recyclingFee).toBeUndefined()
    expect(output.totalVehicleTax).toBeUndefined()
  })
})
