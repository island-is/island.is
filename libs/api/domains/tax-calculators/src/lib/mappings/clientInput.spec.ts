import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import type { CalculatorField } from '@island.is/clients/rsk/calculators'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import type {
  SubmittedValue,
  SubmittedValues,
} from '../validation/calculationInput'
import { toCalculatorKey } from './calculatorType'
import {
  toChildBenefitInput,
  toVehicleBenefitInput,
  toVehicleTaxInput,
  toWithholdingTaxInput,
} from './clientInput'

const client = new CalculatorsClientService()

const sampleValue = (field: CalculatorField): SubmittedValue => {
  switch (field.type) {
    case 'number':
      return 1
    case 'boolean':
      return true
    case 'date':
      return '2026-01-01'
    case 'select':
      return field.options?.[0]?.value ?? ''
    case 'string':
      return 'AB123'
    default: {
      const unhandled: never = field.type
      return unhandled
    }
  }
}

const BUILDERS: Record<
  TaxCalculatorType,
  (values: SubmittedValues) => object
> = {
  [TaxCalculatorType.CHILD_BENEFIT]: toChildBenefitInput,
  [TaxCalculatorType.VEHICLE_TAX]: toVehicleTaxInput,
  [TaxCalculatorType.VEHICLE_BENEFIT]: toVehicleBenefitInput,
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]: toWithholdingTaxInput,
}

/* Each builder reads its values by string literal, indexing a
 * Record<string, unknown>, so only the property name is typechecked -- a typo
 * in the key compiles and yields undefined, silently dropping a value the
 * input validator just accepted. Driving the builders from the real contract
 * is what catches that, for every field rather than the ones a fixture
 * happens to name. */
describe('input builders against the calculator contract', () => {
  it.each(Object.values(TaxCalculatorType))(
    'reads every input field %s declares',
    (type) => {
      const { inputFields } = client.getCalculator(toCalculatorKey(type))
      const values = Object.fromEntries(
        inputFields.map((field) => [field.name, sampleValue(field)]),
      )

      const populated = Object.entries(BUILDERS[type](values))
        .filter(([, value]) => value !== undefined)
        .map(([key]) => key)

      expect(populated.sort()).toEqual(
        inputFields.map((field) => field.name).sort(),
      )
    },
  )
})

describe('client input builders', () => {
  it('builds a child benefit input, omitting absent optional fields', () => {
    expect(
      toChildBenefitInput({
        marriedOrCohabiting: true,
        incomeYear: 2026,
        incomeBase: 9000000,
        numberOfChildren: 2,
        numberOfChildrenUnder7: 1,
        splitCustody: false,
      }),
    ).toEqual({
      marriedOrCohabiting: true,
      incomeYear: 2026,
      incomeBase: 9000000,
      numberOfChildren: 2,
      numberOfChildrenUnder7: 1,
      splitCustody: false,
      splitCustodyChildrenOver7: undefined,
      splitCustodyChildrenUnder7: undefined,
    })
  })

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

  it('builds a vehicle benefit input', () => {
    expect(
      toVehicleBenefitInput({
        purchaseYear: 2024,
        purchasePrice: 6000000,
        isElectric: true,
      }),
    ).toMatchObject({
      purchaseYear: 2024,
      purchasePrice: 6000000,
      isElectric: true,
      employeePaysCharging: undefined,
    })
  })

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

  /* These throws are unreachable once validation has run. They exist so that a
   * required field can be satisfied without a `!` assertion, and so a drifted
   * option tuple fails loudly instead of dropping a submitted value. */
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
