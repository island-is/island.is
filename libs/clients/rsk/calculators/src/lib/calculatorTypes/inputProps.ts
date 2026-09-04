import { z } from 'zod'

import {
  propFromZodType,
  propsFromDiscriminatedUnion,
} from '../utils/zodToInputProp'
import { childBenefitInputSchema } from './childBenefit'
import { interestBenefitInputSchema } from './interestBenefit'
import type { NumericSemantic } from './semantics'
import { vehicleBenefitInputSchema } from './vehicleBenefit'
import { vehicleDepreciationInputSchema } from './vehicleDepreciation'
import { vehicleTaxInputSchema } from './vehicleTax'
import { withholdingTaxInputSchema } from './withholdingTax'

export type CalculatorKey =
  | 'childBenefit'
  | 'vehicleTax'
  | 'vehicleBenefit'
  | 'vehicleDepreciation'
  | 'withholdingTax'
  | 'interestBenefit'

export interface InputProp {
  name: string
  /* `number` is the fallback for a numeric field carrying no semantic marker.
   * It stays a member rather than defaulting to `currency` so an unannotated
   * field renders plainly and is greppable, instead of silently presenting
   * itself as money. */
  inputType: NumericSemantic | 'number' | 'string' | 'boolean' | 'date' | 'enum'
  required: boolean
  options?: string[]
  dependsOn?: { field: string; value: unknown }
}

const schemaByCalculatorKey: Record<CalculatorKey, z.ZodTypeAny> = {
  childBenefit: childBenefitInputSchema,
  vehicleTax: vehicleTaxInputSchema,
  vehicleBenefit: vehicleBenefitInputSchema,
  vehicleDepreciation: vehicleDepreciationInputSchema,
  withholdingTax: withholdingTaxInputSchema,
  interestBenefit: interestBenefitInputSchema,
}

export const getCalculatorInputProps = (key: CalculatorKey): InputProp[] => {
  const schema = schemaByCalculatorKey[key]

  if (schema instanceof z.ZodDiscriminatedUnion) {
    return propsFromDiscriminatedUnion(schema)
  }

  const objectSchema = schema as z.ZodObject<z.ZodRawShape>
  return Object.entries(objectSchema.shape).map(([name, fieldType]) =>
    propFromZodType(name, fieldType as z.ZodTypeAny),
  )
}
