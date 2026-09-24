import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import type { CalculatorField } from '@island.is/clients/rsk/calculators'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { toCalculatorKey } from '../../contract/calculatorKey'
import type { SubmittedValue, SubmittedValues } from '../submission/submission'
import { toChildBenefitInput } from './childBenefit/childBenefit'
import { toVehicleBenefitInput } from './vehicleBenefit/vehicleBenefit'
import { toVehicleTaxInput } from './vehicleTax/vehicleTax'
import { toWithholdingTaxInput } from './withholdingTax/withholdingTax'

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

const BUILDERS: Record<TaxCalculatorType, (values: SubmittedValues) => object> =
  {
    [TaxCalculatorType.CHILD_BENEFIT]: toChildBenefitInput,
    [TaxCalculatorType.VEHICLE_TAX]: toVehicleTaxInput,
    [TaxCalculatorType.VEHICLE_BENEFIT]: toVehicleBenefitInput,
    [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]: toWithholdingTaxInput,
  }

/* Contract-driven coverage catches keys that would otherwise silently drop values. */
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
